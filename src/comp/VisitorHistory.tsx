import { For } from "solid-js";

import type { Visit } from "./Main.tsx";
import styles from "./VisitorHistory.module.css";

interface VisitorHistoryProps {
  visits: () => Visit[];
}

export default function VisitorHistory({ visits }: VisitorHistoryProps) {
  return (
    <div class={styles["history-container"]}>
      <div class={styles["history-card"]}>
        <h2 class={styles["history-title"]}>Recent Visitors</h2>
        <div class={styles["table-container"]}>
          <table class={styles["visits-table"]}>
            <thead>
              <tr>
                <th>IP Address</th>
                <th>Platform</th>
                <th>Date Accessed</th>
                <th>User Agent</th>
              </tr>
            </thead>
            <tbody>
              <For each={visits()}>
                {(visit) => (
                  <tr>
                    <td class={styles["ip-cell"]}>{visit.ip}</td>
                    <td>{visit.platform}</td>
                    <td class={styles["date-cell"]}>
                      {visit.date.toISOString()}
                    </td>
                    <td
                      class={styles["ua-cell"]}
                      title={visit.userAgent ?? undefined}
                    >
                      {visit.userAgent}
                    </td>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
