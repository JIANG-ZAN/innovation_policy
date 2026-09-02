import type { DialogueLine, GameState } from "@/game/model";
import type { ChapterDefinition } from "@/game/model";
import { characterAssets } from "@/content/assets";
import { DialoguePanel } from "./DialoguePanel";
import { SafeImage } from "./SafeImage";
import styles from "./NarrativePanels.module.css";

const stageCharacters: Record<ChapterDefinition["id"], { name: string; src: string }> = {
  infant: { name: "婴儿林一", src: characterAssets.linyi["00"] },
  childhood: { name: "八岁的林一", src: characterAssets.linyi["08"] },
  teen: { name: "十六岁的林一", src: characterAssets.linyi["16"] },
  youth: { name: "二十三岁的林一", src: characterAssets.linyi["23"] },
  adulthood: { name: "三十八岁的林一", src: characterAssets.linyi["38"] },
  midlife: { name: "五十八岁的林一", src: characterAssets.linyi["58"] },
  elder: { name: "九十八岁的林一", src: characterAssets.linyi["98"] },
};

function isSupportingSpeaker(line: DialogueLine): boolean {
  return !line.portrait
    && !/旁白|字幕|公告|通知|系统|AI|问题/.test(line.speaker);
}

export function selectApplicableDialogueLines(
  lines: readonly DialogueLine[],
  state: GameState,
): DialogueLine[] {
  return lines.filter((line) => {
    const condition = line.when;
    if (!condition) return true;

    const allMatch = condition.allFlags?.every((flag) => state.flags.includes(flag)) ?? true;
    const anyMatch = condition.anyFlags?.some((flag) => state.flags.includes(flag)) ?? true;
    const noneMatch = condition.noneFlags?.every((flag) => !state.flags.includes(flag)) ?? true;
    const allowedTendencies = condition.qiTendency
      ? Array.isArray(condition.qiTendency)
        ? condition.qiTendency
        : [condition.qiTendency]
      : null;
    const tendencyMatches = allowedTendencies?.includes(state.qiTendency) ?? true;

    return allMatch && anyMatch && noneMatch && tendencyMatches;
  });
}

interface StorySceneProps {
  chapter: ChapterDefinition;
  state: GameState;
  onAdvance: (lineCount: number) => void;
  onComplete: () => void;
}

export function StoryScene({
  chapter,
  state,
  onAdvance,
  onComplete,
}: StorySceneProps) {
  const lines = selectApplicableDialogueLines(chapter.opening, state);
  const line = lines[Math.min(state.dialogueIndex, Math.max(lines.length - 1, 0))];

  if (!line) {
    return (
      <button type="button" onClick={onComplete}>
        进入选择
      </button>
    );
  }

  return (
    <div className={styles.storyScene} data-stage={chapter.id}>
      <div className={styles.sceneCast} aria-hidden="true">
        <span className={styles.sceneCharacter} data-testid="scene-character">
          <SafeImage
            src={stageCharacters[chapter.id].src}
            alt=""
            fill
            sizes="(max-width: 767px) 7rem, 12rem"
          />
          <span>{stageCharacters[chapter.id].name}</span>
        </span>
      </div>
      {isSupportingSpeaker(line) ? (
        <p className={styles.supportingSpeaker} aria-label={`当前说话人：${line.speaker}`}>
          <span aria-hidden="true" />
          {line.speaker}
        </p>
      ) : null}
      <DialoguePanel
        key={line.id}
        line={line}
        onAdvance={() => {
          if (state.dialogueIndex >= lines.length - 1) {
            onComplete();
          } else {
            onAdvance(lines.length);
          }
        }}
      />
    </div>
  );
}
