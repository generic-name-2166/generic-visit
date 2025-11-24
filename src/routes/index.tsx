import { createFileRoute } from "@tanstack/solid-router";
import { createClientOnlyFn, json, JsonResponse } from "@tanstack/solid-start";
import { createResource, Suspense, type JSX } from "solid-js";

import type { CloudflareContext } from "../server.ts";

interface ClientFingerprint {
  readonly timezoneOffset: number;
  readonly timezone: string;
  readonly width: number;
  readonly height: number;
  readonly colorDepth: number;
  readonly platform: string;
  readonly hardwareConcurrency: number;
}

type Visit = CloudflareContext & ClientFingerprint;

const query = createClientOnlyFn(async (): Promise<Visit[]> => {
  // https://coveryourtracks.eff.org/
  const timezone: string = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const width: number = window.screen.width;
  const height: number = window.screen.height;
  const colorDepth: number = window.screen.colorDepth;
  const platform: string = navigator.platform;
  const hardwareConcurrency = navigator.hardwareConcurrency;
  const body: ClientFingerprint = {
    timezoneOffset: new Date().getTimezoneOffset(),
    timezone,
    width,
    height,
    colorDepth,
    platform,
    hardwareConcurrency,
  };
  const resp = await fetch(window.location.href, {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
  const data: Visit[] = await resp.json();
  return data.map((visit) => ({ ...visit, date: new Date(visit.date) }));
});

function Index(): JSX.Element {
  const [state] = createResource(query);

  return (
    <Suspense>
      <pre>{JSON.stringify(state(), null, 2)}</pre>
    </Suspense>
  );
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
