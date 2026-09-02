import { useState } from "react";
import type { ChapterDefinition, ChoiceDefinition, GameState, StatKey } from "@/game/model";
import { selectApplicableDialogueLines } from "./StoryScene";
import { DialoguePanel } from "./DialoguePanel";
import styles from "./NarrativePanels.module.css";

const statLabels: Record<StatKey, string> = {
  autonomy: "自主",
  discernment: "辨识",
  connection: "联结",
  security: "保障",
  meaning: "意义",
};

interface OutcomePanelProps {
  chapter: ChapterDefinition;
  choice: ChoiceDefinition;
  state: GameState;
  onArchive: () => void;
}

export function OutcomePanel({ chapter, choice, state, onArchive }: OutcomePanelProps) {
  const closingLines = selectApplicableDialogueLines(chapter.closing, state);
  const [closingIndex, setClosingIndex] = useState(0);
  const closingLine = closingLines[closingIndex];

  if (closingLine) {
    return (
      <DialoguePanel
        key={closingLine.id}
        line={closingLine}
        onAdvance={() => setClosingIndex((current) => current + 1)}
      />
    );
  }

  const statChanges = (Object.keys(statLabels) as StatKey[]).flatMap((key) => {
    const value = choice.deltas[key];
    if (!value) return [];
    return [`${statLabels[key]} ${value > 0 ? "+" : "−"}${Math.abs(value)}`];
  });

  return (
    <section
      className={styles.outcome}
      aria-labelledby="outcome-heading"
      data-testid="continue-outcome"
    >
      <p className={styles.eyebrow}>立即结果</p>
      <h2 id="outcome-heading">{choice.title}</h2>
      <ul className={styles.resultList}>
        {choice.immediateOutcome.map((result) => <li key={result}>{result}</li>)}
      </ul>
      {statChanges.length ? (
        <ul className={styles.changeList} aria-label="状态变化">
          {statChanges.map((change) => <li key={change}>{change}</li>)}
        </ul>
      ) : null}
      <div className={styles.echo}>
        <strong>深远回声</strong>
        <p>{choice.delayedEcho}</p>
      </div>
      <button
        className={styles.primaryAction}
        type="button"
        data-testid="open-archive"
        onClick={onArchive}
      >
        记录这一章
      </button>
    </section>
  );
}
