import type { JSX } from "solid-js";

import type { CloudflareContext } from "../server.ts";
import VisitorCard from "./VisitorCard.tsx";
import VisitorHistory from "./VisitorHistory.tsx";
import styles from "./Main.module.css";
import { ClientOnly } from "@tanstack/solid-router";

export interface ClientFingerprint {
  readonly timezoneOffset: number;
  readonly timezone: string;
  readonly width: number;
  readonly height: number;
  readonly colorDepth: number;
  readonly platform: string;
  readonly hardwareConcurrency: number;
}

export type Visit = CloudflareContext & ClientFingerprint;

export default function Main({
  visits,
}: {
  visits: () => Visit[];
}): JSX.Element {
  return (
    <div class={styles["container"]}>
      <header class={styles["header"]}>
        <h1>Generic Visit</h1>
      </header>

      <pre>{JSON.stringify(visits(), null, 2)}</pre>

      <div class={styles["main-content"]}>
        <div class={styles["counter"]}>
          <div class={styles["counter-label"]}>Total Visitors</div>
          <div class={styles["counter-value"]}>{visits().length}</div>
        </div>

        <ClientOnly>
          <VisitorCard visitor={visits()[0]!} />
        </ClientOnly>
      </div>

      <VisitorHistory visits={visits()} />
    </div>
  );
}
