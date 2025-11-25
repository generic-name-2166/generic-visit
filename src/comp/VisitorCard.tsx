import type { Visit } from "./Main.tsx";
import styles from "./VisitorCard.module.css";

interface VisitorCardProps {
  visitor: () => Visit;
}

export default function VisitorCard({ visitor }: VisitorCardProps) {
  return (
    <div class={styles["card"]}>
      <h2 class={styles["card-title"]}>Your Information</h2>
      <div class={styles["info-grid"]}>
        <div class={styles["info-item"]}>
          <div class={styles["info-label"]}>IP Address</div>
          <div class={styles["info-value"]}>{visitor().ip}</div>
        </div>
        <div class={styles["info-item"]}>
          <div class={styles["info-label"]}>Platform</div>
          <div class={styles["info-value"]}>{visitor().platform}</div>
        </div>
        <div class={styles["info-item"]}>
          <div class={styles["info-label"]}>User Agent</div>
          <div class={styles["info-value"]}>{visitor().userAgent}</div>
        </div>
        <div class={styles["info-item"]}>
          <div class={styles["info-label"]}>Date Accessed</div>
          <div class={styles["info-value"]}>{visitor().date.toISOString()}</div>
        </div>
      </div>
    </div>
  );
}
