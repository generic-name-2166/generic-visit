import { createFileRoute, useRouter } from "@tanstack/solid-router";
import { createServerFn } from "@tanstack/solid-start";
import type { JSX } from "solid-js";
import { env } from "cloudflare:workers";

async function readCount(): Promise<number> {
  const cursor = await env.d1_generic_visit
    .prepare("SELECT count FROM counter WHERE id = 0 LIMIT 1")
    .first<{ count: number }>();
  return cursor?.count ?? 0;
}

async function writeCount(count: number): Promise<void> {
  await env.d1_generic_visit
    .prepare("UPDATE counter SET count = ? WHERE id = 0")
    .bind(count)
    .run();
}

const getCount = createServerFn({
  method: "GET",
}).handler(() => {
  return readCount();
});

const updateCount = createServerFn({ method: "POST" })
  .inputValidator((d: number) => d)
  .handler(async ({ data }) => {
    const count = await readCount();
    await writeCount(count + data);
  });

export const Route = createFileRoute("/file")({
  component: Home,
  loader: async () => await getCount(),
});

function Home(): JSX.Element {
  const router = useRouter();
  const state = Route.useLoaderData();

  return (
    <button
      type="button"
      onClick={() => {
        updateCount({ data: 1 })
          .then(() => router.invalidate())
          .catch(console.error);
      }}
    >
      Add 1 to {state()}?
    </button>
  );
}
