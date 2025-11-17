import handler, { createServerEntry } from "@tanstack/solid-start/server-entry";

export interface CloudflareContext {
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
    const userAgent = request.headers.get("user-agent") ?? undefined;
    const ip = request.headers.get("cf-connecting-ip") ?? undefined;
    const { cf } = request;
    const country = cf?.country as string | undefined;
    const city = cf?.city as string | undefined;
    const postalCode = cf?.postalCode as string | undefined;
    return handler.fetch(request, {
      context: { userAgent, ip, country, city, postalCode },
    });
  },
});
