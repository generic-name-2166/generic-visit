import type { JSX } from "solid-js";

import type { Visit } from "../routes/$pageId/index.tsx";
import styles from "./VisitorCard.module.css";

interface VisitorCardProps {
  visitor: () => Visit;
}

export default function VisitorCard({
  visitor,
}: VisitorCardProps): JSX.Element {
  return (
    <section class={styles["card"]}>
      <h2 class={styles["card-title"]}>Your Information</h2>
      <div class={styles["info-grid"]}>
        <div class={styles["info-item"]}>
          <h3 class={styles["info-label"]}>Date Accessed</h3>
          <p class={styles["info-value"]}>{visitor().date.toISOString()}</p>
        </div>
        <div class={styles["info-item"]}>
          <h3 class={styles["info-label"]}>IP Address</h3>
          <p class={styles["info-value"]}>{visitor().ip}</p>
        </div>
        <div class={styles["info-item"]}>
          <h3 class={styles["info-label"]}>User Agent</h3>
          <p class={styles["info-value"]}>{visitor().userAgent}</p>
        </div>
        <div class={styles["info-item"]}>
          <h3 class={styles["info-label"]}>Country</h3>
          <p class={styles["info-value"]}>{visitor().country}</p>
        </div>
        <div class={styles["info-item"]}>
          <h3 class={styles["info-label"]}>City</h3>
          <p class={styles["info-value"]}>{visitor().city}</p>
        </div>
        <div class={styles["info-item"]}>
          <h3 class={styles["info-label"]}>Postal Code</h3>
          <p class={styles["info-value"]}>{visitor().postalCode}</p>
        </div>
        <div class={styles["info-item"]}>
          <h3 class={styles["info-label"]}>Language</h3>
          <p class={styles["info-value"]}>{visitor().language}</p>
        </div>
        <div class={styles["info-item"]}>
          <h3 class={styles["info-label"]}>Accepted Encodings</h3>
          <p class={styles["info-value"]}>{visitor().encoding}</p>
        </div>
        <div class={styles["info-item"]}>
          <h3 class={styles["info-label"]}>Timezone Offset</h3>
          <p class={styles["info-value"]}>{visitor().timezoneOffset}</p>
        </div>
        <div class={styles["info-item"]}>
          <h3 class={styles["info-label"]}>Timezone</h3>
          <p class={styles["info-value"]}>{visitor().timezone}</p>
        </div>
        <div class={styles["info-item"]}>
          <h3 class={styles["info-label"]}>Display Width</h3>
          <p class={styles["info-value"]}>{visitor().width}</p>
        </div>
        <div class={styles["info-item"]}>
          <h3 class={styles["info-label"]}>Display Height</h3>
          <p class={styles["info-value"]}>{visitor().height}</p>
        </div>
        <div class={styles["info-item"]}>
          <h3 class={styles["info-label"]}>Display Color Depth</h3>
          <p class={styles["info-value"]}>{visitor().colorDepth}</p>
        </div>
        <div class={styles["info-item"]}>
          <h3 class={styles["info-label"]}>Platform</h3>
          <p class={styles["info-value"]}>{visitor().platform}</p>
        </div>
        <div class={styles["info-item"]}>
          <h3 class={styles["info-label"]}>Hardware Concurrency</h3>
          <p class={styles["info-value"]}>{visitor().hardwareConcurrency}</p>
        </div>
      </div>
    </section>
  );
}
