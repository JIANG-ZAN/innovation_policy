import { useRef, useState } from "react";
import type { ChoiceDefinition, ChoiceId } from "@/game/model";
import styles from "./NarrativePanels.module.css";

interface ChoicePanelProps {
  choices: readonly [ChoiceDefinition, ChoiceDefinition, ChoiceDefinition];
  selectedId: ChoiceId | null;
  onChoose: (choiceId: ChoiceId) => void;
}

export function ChoicePanel({ choices, selectedId, onChoose }: ChoicePanelProps) {
  const acceptedRef = useRef<ChoiceId | null>(selectedId);
  const [localSelection, setLocalSelection] = useState<ChoiceId | null>(selectedId);
  const lockedId = selectedId ?? localSelection;

  const choose = (choiceId: ChoiceId) => {
    if (acceptedRef.current) return;
    acceptedRef.current = choiceId;
    setLocalSelection(choiceId);
    onChoose(choiceId);
  };

  return (
    <section className={styles.choicePanel} aria-labelledby="choice-heading">
      <div className={styles.panelHeading}>
        <span>请作出选择</span>
        <h2 id="choice-heading">每条路都有代价</h2>
      </div>
      <div className={styles.choiceGrid}>
        {choices.map((choice) => (
          <button
            className={styles.choiceCard}
            type="button"
            key={choice.id}
            data-testid={`choice-${choice.id}`}
            disabled={lockedId !== null}
            aria-pressed={lockedId === choice.id}
            onClick={() => choose(choice.id)}
          >
            <span className={styles.choiceKey}>{choice.key}</span>
            <strong>{choice.title}</strong>
            <span className={styles.choiceSection}>
              <b>行动</b>{choice.action}
            </span>
            <span className={styles.choiceSection}>
              <b>代价与风险</b>{choice.risk}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
