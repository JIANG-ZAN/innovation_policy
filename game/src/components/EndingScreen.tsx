import { endings as endingDefinitions } from "@/content/endings";
import type { GameState, PolicyEnvironment, StatKey } from "@/game/model";
import { deriveRemarks, selectKeyEchoes } from "@/game/selectors";
import styles from "./NarrativePanels.module.css";

const visibleStats: ReadonlyArray<[StatKey, string]> = [
  ["autonomy", "自主"],
  ["discernment", "辨识"],
  ["connection", "联结"],
  ["security", "保障"],
  ["meaning", "意义"],
];

const policyLegacies: Record<PolicyEnvironment, string> = {
  "tech-first":
    "技术优先：AI继续自动分配医疗与教育资源，数字人格默认保留，退出仍需主动申请。",
  "co-governance":
    "共生治理：高风险决定必须由具体的人类签名，模型需要说明证据与不确定性。",
  "human-limits":
    "人本限制：部分高风险AI被暂停使用，线下社区与人工服务重新成为公共保障的一部分。",
  "social-conflict":
    "社会冲突：个人承担了制度惩罚，既有制度本身却只发生了有限改变。",
};

interface EndingScreenProps {
  state: GameState;
  onRestart: () => void;
}

export function EndingScreen({ state, onRestart }: EndingScreenProps) {
  if (!state.endingId) return null;

  const ending = endingDefinitions[state.endingId];
  const echoes = selectKeyEchoes(state).slice(0, 3);
  const remarks = deriveRemarks(state);

  return (
    <section
      className={styles.archive}
      aria-labelledby="ending-title"
      data-testid="ending-screen"
    >
      <p className={styles.eyebrow}>人生终章</p>
      <h2 id="ending-title">{ending.title}</h2>

      <div aria-label="结局叙述">
        {ending.narrative.map((paragraph) => (
          <p className={styles.echo} key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <blockquote className={styles.echo}>{ending.lastLine}</blockquote>
      <p className={styles.question}>{ending.question}</p>

      <section aria-labelledby="ending-stats-heading">
        <h3 id="ending-stats-heading">人生状态侧写</h3>
        <dl className={styles.archiveStats} aria-label="五项人生状态，满值 5">
          {visibleStats.map(([key, label]) => (
            <div key={key}>
              <dt>{label}</dt>
              <dd aria-label={`${label} ${state.stats[key]}，满值 5`}>
                <span style={{ width: `${state.stats[key] * 20}%` }} />
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <div className={styles.archiveColumns}>
        <section aria-labelledby="ending-echoes-heading">
          <h3 id="ending-echoes-heading">关键回响</h3>
          <ul>
            {echoes.map((echo) => <li key={echo}>{echo}</li>)}
          </ul>
        </section>
        <section aria-labelledby="ending-policy-heading">
          <h3 id="ending-policy-heading">社会政策遗产</h3>
          <p>{policyLegacies[state.policy]}</p>
        </section>
        <section aria-labelledby="ending-remarks-heading">
          <h3 id="ending-remarks-heading">附加人生评语</h3>
          {remarks.length ? (
            <ul>{remarks.map((remark) => <li key={remark}>{remark}</li>)}</ul>
          ) : (
            <p>这段人生没有额外附加评语。</p>
          )}
        </section>
      </div>

      <button
        className={styles.primaryAction}
        type="button"
        data-testid="restart-game"
        onClick={onRestart}
      >
        重新开始另一生
      </button>
    </section>
  );
}
