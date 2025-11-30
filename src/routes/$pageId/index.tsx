import { ClientOnly, createFileRoute, notFound } from "@tanstack/solid-router";
import { createIsomorphicFn, json, JsonResponse } from "@tanstack/solid-start";
import { env } from "cloudflare:workers";
import { createEffect, createResource, type JSX } from "solid-js";

import type { CloudflareContext } from "../../server.ts";
import VisitorCard from "../../comp/VisitorCard.tsx";
import VisitorHistory from "../../comp/VisitorHistory.tsx";
import styles from "./index.module.css";

export interface ClientFingerprint {
  readonly timezoneOffset: number;
  readonly timezone: string;
  readonly width: number;
  readonly height: number;
  readonly colorDepth: number;
  readonly platform: string;
  readonly hardwareConcurrency: number;
}

export type Visit = CloudflareContext & ClientFingerprint & { pageId: number };

/**
 * client information is only available on the client duh
 */
const query = createIsomorphicFn()
  .client(async (pageId: number): Promise<Visit[]> => {
    // https://coveryourtracks.eff.org/
    const timezone: string = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const width: number = window.screen.width;
    const height: number = window.screen.height;
    const colorDepth: number = window.screen.colorDepth;
    const platform: string = navigator.platform;
    const hardwareConcurrency = navigator.hardwareConcurrency;
    const body: ClientFingerprint & { pageId: number } = {
      pageId,
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
  .server(async (pageId: number): Promise<Visit[]> => {
    if (Number.isNaN(pageId)) {
      // have to throw these here because `beforeLoad` is for some reason treated by TanStack router as something that can be ran on the client so import { env } causes ann import issue
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw notFound();
    }
    const result = await env.d1_generic_visit
      .prepare("SELECT EXISTS (SELECT * FROM page WHERE id = ?) AS pageExists")
      .bind(pageId)
      .first();
    const exists = result?.["pageExists"];
    if (!exists) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw notFound();
    }
    return [
      {
        pageId,
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
    ];
  });

function RouteComponent(): JSX.Element {
  const params = Route.useParams();
  const pageId = () => parseInt(params().pageId);
  const [state, { refetch }] = createResource(pageId, () => query(pageId()));
  // force fetch on client
  createEffect(refetch);
  const visits = () => state() ?? [];
  return (
    <div class={styles["container"]}>
      <header class={styles["header"]}>
        <h1>Generic Visit</h1>
      </header>

      <main class={styles["main-content"]}>
        <div class={styles["counter"]}>
          <div class={styles["counter-label"]}>Total Visitors</div>
          <div class={styles["counter-value"]}>{visits().length}</div>
        </div>

        <ClientOnly>
          {/* there's always at least 1 visit which is the current user */}
          <VisitorCard visitor={() => visits()[0]!} />
        </ClientOnly>
      </main>

      <VisitorHistory visits={visits} />
    </div>
  );
}

async function newVisit({
  params,
  request,
  context,
}: {
  params: { pageId: string };
  request: Request;
  context: CloudflareContext;
}): Promise<JsonResponse<Visit[]>> {
  const pageId: number = parseInt(params.pageId);
  const body: ClientFingerprint = await request.json();
  const current: Visit = { ...body, ...context, pageId };

  const INSERT_STMT = `
    INSERT INTO visit (
      pageId,
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
      ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?
    )
  `;
  const SELECT_STMT = `
    SELECT 
      pageId, 
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
    WHERE pageId = ?
  `;
  try {
    await env.d1_generic_visit
      .prepare(INSERT_STMT)
      .bind(
        pageId,
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
      .bind(pageId)
      .run();
    const visits: Visit[] = result.results as unknown as Visit[];
    return json(visits);
  } catch (e) {
    console.error(e);
  }

  return json([current]);
}

export const Route = createFileRoute("/$pageId/")({
  component: RouteComponent,
  ssr: true,
  // beforeLoad,
  server: {
    handlers: {
      POST: newVisit,
    },
  },
});
