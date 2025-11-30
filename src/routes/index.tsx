import { createFileRoute } from "@tanstack/solid-router";
import type { JSX } from "solid-js";
import { env } from "cloudflare:workers";

function Index(): JSX.Element {
  return (
    <div>
      <header>
        <h1>Generic Visit</h1>
      </header>

      <main>
        Create A Page
        <form method="post" action=".">
          <button type="submit">Create</button>
        </form>
      </main>
    </div>
  );
}

/**
 * @returns response that redirects to the created page
 */
async function createPage(): Promise<Response> {
  const createdAt: number = Date.now();
  const result = await env.d1_generic_visit
    .prepare("INSERT INTO page (createdAt) VALUES (?) RETURNING id")
    .bind(createdAt)
    .first();
  if (!result?.["id"]) {
    throw new Error("couldn't create a new page");
  }
  const url = `./${result["id"] as number}`;
  return Response.redirect(url);
}

export const Route = createFileRoute("/")({
  component: Index,
  // unfortunate FOUC with CSS modules with SSR, no CSS at all without
  // https://github.com/TanStack/router/issues/3023
  ssr: true,
  server: {
    handlers: {
      POST: createPage,
    },
  },
});
