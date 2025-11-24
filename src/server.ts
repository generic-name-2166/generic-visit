import handler, { createServerEntry } from "@tanstack/solid-start/server-entry";

export interface CloudflareContext {
  date: Date;
  userAgent?: string;
  ip?: string;
  country?: string;
  city?: string;
  postalCode?: string;
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
    const date = new Date(request.headers.get("date") ?? 0);
    // accept header is useless on POST request as it is always "*/*"
    const userAgent = request.headers.get("user-agent") ?? undefined;
    const ip = request.headers.get("cf-connecting-ip") ?? undefined;
    const country = request.cf?.country as string | undefined;
    const city = request.cf?.city as string | undefined;
    const postalCode = request.cf?.postalCode as string | undefined;
    const context = { date, userAgent, ip, country, city, postalCode };
    return handler.fetch(request, {
      context,
    });
  },
});
