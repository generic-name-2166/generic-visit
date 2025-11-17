import { createFileRoute } from "@tanstack/solid-router";
import { createServerFn } from "@tanstack/solid-start";
import type { JSX } from "solid-js";

import type { CloudflareContext } from "../server.ts";

interface Visit {
  userAgent?: string;
  ip?: string;
  country?: string;
  city?: string;
  postalCode?: string;
}

async function insertVisit({
  context,
}: {
  context: CloudflareContext;
}): Promise<Visit[]> {
  return Promise.resolve([context]);
}

const query = createServerFn({
  method: "GET",
}).handler(insertVisit);

function Index(): JSX.Element {
  const state = Route.useLoaderData();

  return <pre>{state()}</pre>;
}

export const Route = createFileRoute("/")({
  component: Index,
  loader: async () => await query(),
});
