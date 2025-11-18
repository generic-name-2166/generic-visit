import { createFileRoute } from "@tanstack/solid-router";
import { createClientOnlyFn, json, JsonResponse } from "@tanstack/solid-start";
import { createResource, type JSX } from "solid-js";

import type { CloudflareContext } from "../server.ts";

interface ClientFingerprint {
  timezoneOffset: number;
}

type Visit = CloudflareContext & ClientFingerprint;

const query = createClientOnlyFn(async (): Promise<Visit[]> => {
  // https://coveryourtracks.eff.org/
  const body = { timezoneOffset: new Date().getTimezoneOffset() };
  const resp = await fetch(window.location.href, {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
  return resp.json();
});

function Index(): JSX.Element {
  const [state] = createResource(query);

  return <pre>{JSON.stringify(state(), null, 2)}</pre>;
}

export const Route = createFileRoute("/")({
  component: Index,
  // TODO: make this ssr more granular
  ssr: false,
  server: {
    handlers: {
      POST: async ({ request, context }): Promise<JsonResponse<Visit[]>> => {
        const body: ClientFingerprint = await request.json();
        return json([{ ...body, ...context } satisfies Visit]);
      },
    },
  },
});
