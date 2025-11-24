import handler, { createServerEntry } from "@tanstack/solid-start/server-entry";

export interface CloudflareContext {
  date: Date;
  userAgent?: string;
  ip?: string;
  country?: string;
  city?: string;
  postalCode?: string;
  language: string;
  encoding?: string;
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
    const userAgent = request.headers.get("user-agent") ?? undefined;
    const ip = request.headers.get("cf-connecting-ip") ?? undefined;
    const country = request.cf?.country as string | undefined;
    const city = request.cf?.city as string | undefined;
    const postalCode = request.cf?.postalCode as string | undefined;
    // en-US,en;q=0.7  https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Accept-Language
    // only the first language is typically used for privacy
    const language: string =
      (request.headers.get("accept-language") ?? "")
        .split(",")
        .at(0)
        ?.split(";")
        .at(0) ?? "";
    const encoding = request.headers.get("accept-encoding") ?? undefined;
    const context = {
      date,
      userAgent,
      ip,
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
