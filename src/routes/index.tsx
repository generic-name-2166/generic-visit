import { createFileRoute } from "@tanstack/solid-router";
import { createIsomorphicFn, json, JsonResponse } from "@tanstack/solid-start";
import { createEffect, createResource, type JSX } from "solid-js";
import { env } from "cloudflare:workers";

import Main, { type ClientFingerprint, type Visit } from "../comp/Main.tsx";
import type { CloudflareContext } from "../server.ts";

/**
 * client information is only available on the client duh
 */
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
  .server(
    (): Promise<Visit[]> =>
      Promise.resolve([
        {
          date: new Date(),
          ip: null,
          userAgent: null,
          country: null,
          city: null,
          postalCode: null,
          language: "en",
          encoding: null,
          timezoneOffset: 0,
          timezone: "",
          width: 0,
          height: 0,
          colorDepth: 0,
          platform: "",
          hardwareConcurrency: 0,
        } satisfies Visit,
      ]),
  );

function Index(): JSX.Element {
  const [state, { refetch }] = createResource(() => query());
  // force fetch on client
  createEffect(refetch);
  const visits = () => state() ?? [];
  return <Main visits={visits} />;
}

async function handlePost({
  request,
  context,
}: {
  request: Request;
  context: CloudflareContext;
}): Promise<JsonResponse<Visit[]>> {
  const body: ClientFingerprint = await request.json();
  const current: Visit = { ...body, ...context };

  const INSERT_STMT = `
    INSERT INTO visit (
      date,
      ip,
      user_agent,
      country,
      city,
      postal_code,
      language,
      encoding,
      timezone_offset,
      timezone,
      width,
      height,
      color_depth,
      platform,
      hardware_concurrency
    ) VALUES (
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?
    )
  `;
  const SELECT_STMT = `
    SELECT 
      date,
      ip,
      user_agent,
      country,
      city,
      postal_code,
      language,
      encoding,
      timezone_offset,
      timezone,
      width,
      height,
      color_depth,
      platform,
      hardware_concurrency
    FROM visit
  `;
  try {
    await env.d1_generic_visit
      .prepare(INSERT_STMT)
      .bind(
        current.date.valueOf(),
        current.ip,
        current.userAgent,
        current.country,
        current.city,
        current.postalCode,
        current.language,
        current.encoding,
        current.timezoneOffset,
        current.timezone,
        current.width,
        current.height,
        current.colorDepth,
        current.platform,
        current.hardwareConcurrency,
      )
      .run();
    const result = await env.d1_generic_visit
      .prepare(SELECT_STMT)
      .run();
    const visits: Visit[] = result.results as unknown as Visit[];
    return json(visits);
  } catch (e) {
    console.error(e);
  }

  return json([current]);
}

export const Route = createFileRoute("/")({
  component: Index,
  // unfortunate FOUC with CSS modules with SSR, no CSS at all without
  // https://github.com/TanStack/router/issues/3023
  ssr: true,
  server: {
    handlers: {
      POST: handlePost,
    },
  },
});
