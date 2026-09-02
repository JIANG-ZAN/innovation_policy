import { chapters } from "@/content";
import { choiceDefinitions } from "@/content/choices";
import { selectKeyEchoes } from "@/game/selectors";
import type { ChapterDefinition, GameState, StatKey, XiaomanRelation } from "@/game/model";
import styles from "./NarrativePanels.module.css";

const stats: ReadonlyArray<[StatKey, string]> = [
  ["autonomy", "自主"], ["discernment", "辨识"], ["connection", "联结"],
  ["security", "保障"], ["meaning", "意义"],
];
const relationText: Record<XiaomanRelation, string> = {
  unmet: "尚未建立重要羁绊", acquaintance: "彼此识得",
  bond: "小满与你保持羁绊", "strong-bond": "小满是坚定的现实支点",
  estranged: "与小满的关系已决裂", lost: "已与小满失去联系",
};

interface LifeArchiveBaseProps {
  chapter: ChapterDefinition;
  state: GameState;
}

type LifeArchiveProps = LifeArchiveBaseProps & (
  | { mode: "preview"; onClose: () => void }
  | { mode: "committed"; onAdvance: () => void }
);

export function LifeArchive(props: LifeArchiveProps) {
  const { chapter, state } = props;
  const pastChoices = chapters.flatMap((item) => {
    const id = state.choices[item.id];
    return id ? [choiceDefinitions[id]] : [];
  });
  const echoes = selectKeyEchoes(state);
  const canAdvance = Boolean(state.choices[chapter.id]);
  const advanceLabel = state.stageIndex < chapters.length - 1
    ? "进入下一阶段"
    : "查看人生结局";

  return (
    <section className={styles.archive} aria-labelledby="archive-heading">
      <p className={styles.eyebrow}>人生档案</p>
      <h2 id="archive-heading">{chapter.question}</h2>
      <ol className={styles.progress} aria-label="7 阶段人生进度">
        {chapters.map((item, index) => (
          <li key={item.id} aria-current={index === state.stageIndex ? "step" : undefined}>
            <span>{index + 1}/7</span>{item.title.split("——")[0]}
          </li>
        ))}
      </ol>
      <dl className={styles.archiveStats} aria-label="五项人生状态，满值 5">
        {stats.map(([key, label]) => (
          <div key={key}>
            <dt>{label}</dt>
            <dd aria-label={`${label} ${state.stats[key]}，满值 5`}>
              <span style={{ width: `${state.stats[key] * 20}%` }} />
            </dd>
          </div>
        ))}
      </dl>
      <div className={styles.archiveColumns}>
        <section><h3>已作选择</h3><ul>{pastChoices.length ? pastChoices.map((choice) => <li key={choice.id}>{choice.title}</li>) : <li>尚未记录选择</li>}</ul></section>
        <section><h3>关系</h3><p>{relationText[state.xiaomanRelation]}</p></section>
        <section><h3>关键回声</h3><ul>{echoes.length ? echoes.map((echo) => <li key={echo}>{echo}</li>) : <li>回声尚未形成</li>}</ul></section>
      </div>
      {props.mode === "preview" ? (
        <button className={styles.primaryAction} type="button" onClick={props.onClose}>
          返回当前章节
        </button>
      ) : (
        <button
          className={styles.primaryAction}
          type="button"
          data-testid="next-stage"
          disabled={!canAdvance}
          onClick={props.onAdvance}
        >
          {advanceLabel}
        </button>
      )}
    </section>
  );
}
