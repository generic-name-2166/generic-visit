import { createFileRoute, useRouter } from "@tanstack/solid-router";
import { createServerFn } from "@tanstack/solid-start";
import type { JSX } from "solid-js";

// import { env } from "cloudflare:workers";

function readCount() {
  return Promise.resolve(0);
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
    console.log(count + data);
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
