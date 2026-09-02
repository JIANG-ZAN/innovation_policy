import type { ChapterDefinition } from "@/game/model";
import styles from "./NarrativePanels.module.css";

export function StageTransition({ chapter }: { chapter: ChapterDefinition }) {
  return (
    <p
      className={styles.stageTransition}
      role="status"
      data-testid="stage-transition"
      data-year={chapter.year}
    >
      <span>第 {chapter.order} 阶段</span>
      <strong>{chapter.age} 岁</strong>
    </p>
  );
}
