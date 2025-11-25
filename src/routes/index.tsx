import { createFileRoute } from "@tanstack/solid-router";
import {
  createIsomorphicFn,
  json,
  JsonResponse,
} from "@tanstack/solid-start";
import { createResource, type JSX } from "solid-js";

import Main, { type ClientFingerprint, type Visit } from "../comp/Main.tsx";

const query = createIsomorphicFn()
  .client(async (): Promise<Visit[]> => {
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
  })
  .server((): Visit[] => [
    {
      date: new Date(),
      language: "",
      timezoneOffset: 0,
      timezone: "",
      width: 0,
      height: 0,
      colorDepth: 0,
      platform: "",
      hardwareConcurrency: 0,
    } satisfies Visit,
  ]);

function Index(): JSX.Element {
  const [state] = createResource(query);

  return (
    <>
      {/* <pre>{JSON.stringify(state(), null, 2)}</pre> */}
      <Main visits={() => state() ?? []} />
    </>
  );
}

export const Route = createFileRoute("/")({
  component: Index,
  // unfortunate FOUC with CSS modules with SSR, no CSS at all without
  // https://github.com/TanStack/router/issues/3023
  ssr: true,
  server: {
    handlers: {
      POST: async ({ request, context }): Promise<JsonResponse<Visit[]>> => {
        const body: ClientFingerprint = await request.json();
        return json([{ ...body, ...context } satisfies Visit]);
      },
    },
  },
});
