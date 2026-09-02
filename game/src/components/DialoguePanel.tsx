import { useEffect, useId, useState } from "react";
import type { DialogueLine } from "@/game/model";
import { SafeImage } from "./SafeImage";
import styles from "./NarrativePanels.module.css";

const CHARACTER_INTERVAL_MS = 50;

interface DialoguePanelProps {
  line: DialogueLine;
  onAdvance: () => void;
}

export function DialoguePanel({ line, onAdvance }: DialoguePanelProps) {
  const [visibleCharacters, setVisibleCharacters] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const actionHintId = useId();
  const complete = reducedMotion || visibleCharacters >= line.text.length;

  useEffect(() => {
    const query = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!query) return;

    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener?.("change", update);
    return () => query.removeEventListener?.("change", update);
  }, []);

  useEffect(() => {
    if (complete) return;

    const timer = window.setInterval(() => {
      setVisibleCharacters((current) => Math.min(current + 1, line.text.length));
    }, CHARACTER_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [complete, line.text.length]);

  const handleActivation = () => {
    if (!complete) {
      setVisibleCharacters(line.text.length);
      return;
    }
    onAdvance();
  };

  return (
    <button
      className={styles.dialogue}
      type="button"
      data-testid="dialogue-panel"
      aria-label={`${line.speaker}：${line.text}`}
      aria-describedby={actionHintId}
      onClick={handleActivation}
    >
      {line.portrait ? (
        <span className={styles.portrait}>
          <SafeImage
            src={line.portrait}
            alt={`${line.speaker}角色立绘`}
            fill
            sizes="7rem"
          />
        </span>
      ) : null}
      <span className={styles.dialogueCopy}>
        <strong className={styles.speaker}>{line.speaker}</strong>
        <span className={styles.dialogueText} data-testid="dialogue-text">
          {complete ? line.text : line.text.slice(0, visibleCharacters)}
        </span>
        <span className={styles.continueHint} id={actionHintId}>
          {complete ? "继续对白" : "显示完整对白"}
        </span>
      </span>
    </button>
  );
}
