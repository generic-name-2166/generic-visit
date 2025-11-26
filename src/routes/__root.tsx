/// <reference types="vite/client" />

import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/solid-router";
import * as Solid from "solid-js";
import { HydrationScript } from "solid-js/web";

import styles from "../general.css?inline";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Generic Visit",
      },
    ],
    // styles: is bugged somehow setting .innerhtml instead of .innerHtml
    // styles: [{ children: styles }],
  }),
  component: RootComponent,
});

function RootComponent(): Solid.JSX.Element {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({
  children,
}: Readonly<{ children: Solid.JSX.Element }>): Solid.JSX.Element {
  return (
    <html lang="en">
      <head>
        <HydrationScript />
        <style>{styles}</style>
      </head>
      <body>
        <HeadContent />
        <Solid.Suspense>{children}</Solid.Suspense>
        <Scripts />
      </body>
    </html>
  );
}
