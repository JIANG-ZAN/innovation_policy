import type {
  ChoiceDefinition,
  GameState,
  PolicyEnvironment,
  QiTendency,
  StageId,
  StatKey,
  XiaomanRelation,
} from "./model";

const statKeys: StatKey[] = [
  "autonomy",
  "discernment",
  "connection",
  "security",
  "meaning",
];

export function clampStat(value: number): number {
  return Math.max(0, Math.min(5, value));
}

export function applyChoice(state: GameState, choice: ChoiceDefinition): GameState {
  const stage = choice.id.split("-")[0] as StageId;

  if (state.choices[stage]) {
    return state;
  }

  const stats = { ...state.stats };
  for (const statKey of statKeys) {
    stats[statKey] = clampStat(stats[statKey] + (choice.deltas[statKey] ?? 0));
  }

  return {
    ...state,
    stats,
    publicInfluence: clampStat(
      state.publicInfluence + (choice.deltas.publicInfluence ?? 0),
    ),
    flags: [...new Set([...state.flags, ...choice.addFlags])],
    choices: { ...state.choices, [stage]: choice.id },
    pendingChoiceId: choice.id,
  };
}

function withFlag(flags: readonly string[], flag: string): string[] {
  return flags.includes(flag) ? [...flags] : [...flags, flag];
}

export function resolveConditionalFlags(state: GameState): GameState {
  let flags = [...state.flags];
  let security = state.stats.security;

  if (state.pendingChoiceId === "teen-a") {
    const hadBond = flags.includes("小满羁绊");
    flags = flags.filter(
      (flag) => flag !== "小满关系中断" && flag !== "小满羁绊",
    );
    flags = withFlag(flags, hadBond ? "小满决裂" : "小满失联");
  }

  if (state.pendingChoiceId === "teen-b") {
    flags = withFlag(flags, "小满羁绊");
  }

  if (
    state.pendingChoiceId === "adulthood-c" &&
    deriveXiaomanRelation(flags) !== "bond" &&
    deriveXiaomanRelation(flags) !== "strong-bond"
  ) {
    flags = withFlag(flags, "现实孤立");
  }

  if (
    state.pendingChoiceId === "midlife-b" &&
    (state.stats.discernment >= 4 ||
      flags.some((flag) =>
        ["查证习惯", "决策顾问", "AI责任倡议"].includes(flag),
      ) ||
      state.publicInfluence >= 4)
  ) {
    flags = withFlag(flags, "复核胜诉");
  }

  if (state.pendingChoiceId === "midlife-c") {
    if (state.stats.connection >= 3 || flags.includes("地下互助")) {
      flags = withFlag(flags, "社区支援");
    } else if (!flags.includes("制度惩罚")) {
      flags = withFlag(flags, "制度惩罚");
      security = clampStat(security - 1);
    }
  }

  return {
    ...state,
    flags,
    stats:
      security === state.stats.security
        ? state.stats
        : { ...state.stats, security },
  };
}

export function deriveXiaomanRelation(
  flags: readonly string[],
): XiaomanRelation {
  if (flags.includes("小满决裂")) {
    return "estranged";
  }
  if (flags.includes("小满失联")) {
    return "lost";
  }
  if (flags.includes("地下互助") && flags.includes("小满羁绊")) {
    return "strong-bond";
  }
  if (flags.includes("小满羁绊") || flags.includes("公开申诉")) {
    return "bond";
  }
  return "unmet";
}

export function deriveQiTendency(
  state: Pick<GameState, "stats" | "flags">,
): QiTendency {
  const { autonomy, discernment, security } = state.stats;

  if (
    autonomy <= 1 &&
    state.flags.some((flag) => ["答案依赖", "最优人生合同"].includes(flag))
  ) {
    return "guardian";
  }
  if (state.flags.includes("无植入") || autonomy >= 4) {
    return "tool";
  }
  if (
    discernment >= 3 &&
    autonomy > 0 &&
    autonomy < 5 &&
    security > 0 &&
    security < 5
  ) {
    return "symbiotic";
  }
  return "guardian";
}

export function derivePolicy(
  state: Pick<GameState, "flags" | "publicInfluence">,
): PolicyEnvironment {
  if (state.flags.includes("接受医疗判定")) {
    return "tech-first";
  }
  if (state.flags.includes("非法治疗")) {
    return state.flags.includes("社区支援") || state.publicInfluence >= 4
      ? "human-limits"
      : "social-conflict";
  }
  if (state.flags.includes("复核胜诉") || state.publicInfluence >= 4) {
    return "co-governance";
  }
  return "tech-first";
}
