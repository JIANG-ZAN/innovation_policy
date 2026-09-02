import type { Stats } from "@/game/model";
import styles from "./LifeHud.module.css";

const statLabels: ReadonlyArray<[keyof Stats, string]> = [
  ["autonomy", "自主"],
  ["discernment", "辨识"],
  ["connection", "联结"],
  ["security", "保障"],
  ["meaning", "意义"],
];

interface LifeHudProps {
  stats: Stats;
}

export function LifeHud({ stats }: LifeHudProps) {
  return (
    <aside className={styles.hud} aria-label="人生状态">
      <dl className={styles.stats}>
        {statLabels.map(([key, label]) => (
          <div className={styles.stat} key={key}>
            <dt>{label}</dt>
            <dd aria-label={`${label} ${stats[key]}，满值 5`}>
              <span className={styles.value}>{stats[key]}</span>
              <span className={styles.track} aria-hidden="true">
                <span
                  className={styles.fill}
                  style={{ width: `${(stats[key] / 5) * 100}%` }}
                />
              </span>
            </dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}
