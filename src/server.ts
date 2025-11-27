import handler, { createServerEntry } from "@tanstack/solid-start/server-entry";

/**
 * TODO Cloudflare D1 disallows undefined
 */
export interface CloudflareContext {
  date: Date;
  ip: string | null;
  userAgent: string | null;
  country: string | null;
  city: string | null;
  postalCode: string | null;
  language: string;
  encoding: string | null;
}

declare module "@tanstack/solid-start" {
  interface Register {
    server: {
      requestContext: CloudflareContext;
    };
  }
}

export default createServerEntry({
  fetch(request) {
    const date = new Date(request.headers.get("date") ?? Date.now());
    // accept header is useless on POST request as it is always "*/*"
    const ip = request.headers.get("cf-connecting-ip");
    const userAgent = request.headers.get("user-agent");
    const country = (request.cf?.country as string | undefined) ?? null;
    const city = (request.cf?.city as string | undefined) ?? null;
    const postalCode = (request.cf?.postalCode as string | undefined) ?? null;
    // en-US,en;q=0.7  https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Accept-Language
    // only the first language is typically used for privacy
    const language: string =
      request.headers
        .get("accept-language")
        ?.split(",")
        .at(0)
        ?.split(";")
        .at(0) ?? "en";
    const encoding = request.headers.get("accept-encoding");
    const context: CloudflareContext = {
      date,
      ip,
      userAgent,
      country,
      city,
      postalCode,
      language,
      encoding,
    };
    return handler.fetch(request, {
      context,
    });
  },
});
