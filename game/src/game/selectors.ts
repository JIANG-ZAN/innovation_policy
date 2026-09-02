import { choiceDefinitions } from "../content/choices";
import type { ChoiceId, EndingId, GameState, StageId } from "./model";
import { deriveXiaomanRelation } from "./rules";

const stageOrder: StageId[] = [
  "infant",
  "childhood",
  "teen",
  "youth",
  "adulthood",
  "midlife",
  "elder",
];

function warnEndingFallback(message: string): void {
  if (process.env.NODE_ENV === "development") {
    console.warn(message);
  }
}

export function deriveEnding(state: GameState): EndingId {
  switch (state.choices.elder) {
    case "elder-a": {
      if (
        state.stats.security >= 4 &&
        state.flags.includes("精英延寿资格")
      ) {
        return "endless-node";
      }
      warnEndingFallback("Incomplete biological-longevity eligibility; using data ghost.");
      return "data-ghost";
    }
    case "elder-b": {
      if (
        state.publicInfluence >= 4 &&
        state.flags.some((flag) =>
          ["复核胜诉", "AI责任倡议"].includes(flag),
        )
      ) {
        return "rule-shaper";
      }
      warnEndingFallback("Incomplete rule-shaper eligibility; using bounded symbiosis.");
      return "bounded-symbiosis";
    }
    case "elder-c": {
      const relation = deriveXiaomanRelation(state.flags);
      if (
        state.stats.connection >= 3 ||
        relation === "bond" ||
        relation === "strong-bond" ||
        state.flags.includes("社区支援")
      ) {
        return "human-warmth";
      }
      warnEndingFallback("Incomplete human-warmth eligibility; using trace-free exit.");
      return "trace-free-exit";
    }
    default:
      warnEndingFallback("Unable to derive an ending without a valid elder choice.");
      return "trace-free-exit";
  }
}

export function deriveRemarks(state: GameState): string[] {
  const remarks: string[] = [];

  if (
    state.stats.autonomy <= 1 &&
    state.flags.includes("答案依赖") &&
    state.flags.includes("最优人生合同")
  ) {
    remarks.push("被托管的一生");
  }
  if (
    state.stats.autonomy >= 4 &&
    state.flags.some((flag) =>
      ["拒绝预测", "非法治疗", "地下互助"].includes(flag),
    )
  ) {
    remarks.push("未被预测的人");
  }
  if (
    state.stats.discernment >= 4 &&
    state.flags.filter((flag) =>
      ["查证习惯", "公开申诉", "决策顾问", "人类复核", "复核胜诉"].includes(
        flag,
      ),
    ).length >= 2
  ) {
    remarks.push("校准者");
  }
  if (state.flags.includes("昼海居民") && state.stats.connection <= 1) {
    remarks.push("万千熟人");
  }

  const relation = deriveXiaomanRelation(state.flags);
  if (
    (relation === "bond" || relation === "strong-bond") &&
    state.flags.some((flag) =>
      ["公开申诉", "地下互助", "社区支援"].includes(flag),
    )
  ) {
    remarks.push("小满在场");
  }

  return remarks;
}

type EchoCategory = "ending" | "policy" | "xiaoman" | "final";

const policyChoices = new Set<ChoiceId>([
  "childhood-b",
  "youth-b",
  "adulthood-b",
  "midlife-a",
  "midlife-b",
  "midlife-c",
]);
const xiaomanChoices = new Set<ChoiceId>([
  "childhood-c",
  "teen-a",
  "teen-b",
  "teen-c",
  "adulthood-c",
  "midlife-c",
]);

function endingChoices(finalChoice: ChoiceId | undefined): Set<ChoiceId> {
  switch (finalChoice) {
    case "elder-a":
      return new Set(["adulthood-a"]);
    case "elder-b":
      return new Set([
        "childhood-b",
        "youth-b",
        "adulthood-b",
        "midlife-b",
      ]);
    case "elder-c":
      return new Set(["childhood-c", "teen-c", "midlife-c"]);
    default:
      return new Set();
  }
}

function echoCategories(
  choiceId: ChoiceId,
  finalChoice: ChoiceId | undefined,
): Set<EchoCategory> {
  const categories = new Set<EchoCategory>();
  if (choiceId.startsWith("elder-")) categories.add("final");
  if (endingChoices(finalChoice).has(choiceId)) categories.add("ending");
  if (policyChoices.has(choiceId)) categories.add("policy");
  if (xiaomanChoices.has(choiceId)) categories.add("xiaoman");
  return categories;
}

export function selectKeyEchoes(state: GameState): string[] {
  const candidates = stageOrder.flatMap((stage, stageIndex) => {
    const choiceId = state.choices[stage];
    if (!choiceId) return [];

    const choice = choiceDefinitions[choiceId];
    return [{
      choiceId,
      echo: choice.delayedEcho,
      stageIndex,
      categories: echoCategories(choiceId, state.choices.elder),
    }];
  });

  const selected: typeof candidates = [];
  const covered = new Set<EchoCategory>();
  const finalChoice = candidates.find((candidate) =>
    candidate.categories.has("final"),
  );
  if (finalChoice) {
    selected.push(finalChoice);
    covered.add("final");
  }

  while (selected.length < 3) {
    const remaining = candidates.filter(
      (candidate) =>
        !selected.includes(candidate) &&
        !selected.some((item) => item.echo === candidate.echo),
    );
    if (remaining.length === 0) break;

    const ranked = remaining
      .map((candidate) => ({
        candidate,
        uncovered: [...candidate.categories].filter(
          (category) => !covered.has(category),
        ).length,
        total: candidate.categories.size,
      }))
      .sort(
        (left, right) =>
          right.uncovered - left.uncovered ||
          right.total - left.total ||
          left.candidate.stageIndex - right.candidate.stageIndex,
      );

    const next = ranked[0]?.candidate;
    if (!next) break;
    selected.push(next);
    for (const category of next.categories) covered.add(category);
  }

  return selected
    .sort((left, right) => left.stageIndex - right.stageIndex)
    .map(({ echo }) => echo);
}
