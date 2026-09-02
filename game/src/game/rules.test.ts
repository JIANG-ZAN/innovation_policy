import { describe, expect, it } from "vitest";
import { choiceDefinitions } from "../content/choices";
import { createInitialGameState, initialGameState } from "./initial-state";
import type { ChoiceDefinition, GameState } from "./model";
import {
  applyChoice,
  clampStat,
  derivePolicy,
  deriveQiTendency,
  deriveXiaomanRelation,
  resolveConditionalFlags,
} from "./rules";

const makeRuleState = (patch: Partial<GameState> = {}): GameState => ({
  ...createInitialGameState(),
  ...patch,
  stats: { ...createInitialGameState().stats, ...patch.stats },
});

describe("clampStat", () => {
  it("keeps every visible and hidden stat between zero and five", () => {
    expect(clampStat(-3)).toBe(0);
    expect(clampStat(3)).toBe(3);
    expect(clampStat(9)).toBe(5);
  });
});

describe("applyChoice", () => {
  it.each([
    ["infant-a", { autonomy: 1, discernment: 2, connection: 1, security: 4, meaning: 1 }, 0, ["全量芯片", "终身数据授权"]],
    ["infant-b", { autonomy: 3, discernment: 2, connection: 1, security: 3, meaning: 1 }, 0, ["监护型芯片", "人类确认权"]],
    ["infant-c", { autonomy: 4, discernment: 1, connection: 2, security: 1, meaning: 1 }, 0, ["无植入", "个人数据权"]],
    ["childhood-a", { autonomy: 2, discernment: 0, connection: 1, security: 3, meaning: 0 }, 0, ["答案依赖"]],
    ["childhood-b", { autonomy: 3, discernment: 3, connection: 1, security: 2, meaning: 2 }, 0, ["查证习惯"]],
    ["childhood-c", { autonomy: 2, discernment: 1, connection: 3, security: 2, meaning: 2 }, 0, ["小满羁绊", "线下协作"]],
    ["teen-a", { autonomy: 1, discernment: 1, connection: 0, security: 4, meaning: 1 }, 0, ["制度信任", "小满关系中断"]],
    ["teen-b", { autonomy: 2, discernment: 2, connection: 2, security: 2, meaning: 2 }, 2, ["公开申诉"]],
    ["teen-c", { autonomy: 3, discernment: 1, connection: 3, security: 1, meaning: 1 }, 1, ["地下互助", "小满羁绊"]],
    ["youth-a", { autonomy: 1, discernment: 1, connection: 1, security: 4, meaning: 1 }, 0, ["最优人生合同", "人格设计师"]],
    ["youth-b", { autonomy: 2, discernment: 2, connection: 1, security: 2, meaning: 3 }, 1, ["决策顾问", "人类责任"]],
    ["youth-c", { autonomy: 4, discernment: 1, connection: 2, security: 1, meaning: 2 }, 0, ["拒绝预测", "社区工作者"]],
    ["adulthood-a", { autonomy: 1, discernment: 1, connection: 0, security: 4, meaning: 1 }, 0, ["平台管理者", "精英延寿资格"]],
    ["adulthood-b", { autonomy: 2, discernment: 1, connection: 2, security: 2, meaning: 3 }, 2, ["公共服务", "AI责任倡议"]],
    ["adulthood-c", { autonomy: 2, discernment: 1, connection: 0, security: 3, meaning: 2 }, 0, ["昼海居民"]],
    ["midlife-a", { autonomy: 1, discernment: 1, connection: 1, security: 3, meaning: 0 }, 0, ["接受医疗判定", "数字周岚"]],
    ["midlife-b", { autonomy: 3, discernment: 1, connection: 1, security: 1, meaning: 1 }, 2, ["人类复核"]],
    ["midlife-c", { autonomy: 4, discernment: 1, connection: 1, security: 0, meaning: 1 }, 1, ["非法治疗"]],
    ["elder-a", { autonomy: 2, discernment: 1, connection: 1, security: 2, meaning: 1 }, 0, ["选择永生"]],
    ["elder-b", { autonomy: 2, discernment: 1, connection: 1, security: 2, meaning: 1 }, 0, ["选择边界"]],
    ["elder-c", { autonomy: 2, discernment: 1, connection: 1, security: 2, meaning: 1 }, 0, ["选择删除"]],
  ] as const)("applies %s exactly once", (choiceId, expectedStats, expectedInfluence, flags) => {
    const next = applyChoice(initialGameState, choiceDefinitions[choiceId]);

    expect(next.stats).toEqual(expectedStats);
    expect(next.publicInfluence).toBe(expectedInfluence);
    expect(next.flags).toEqual(expect.arrayContaining([...flags]));
    expect(next.choices).toEqual({ [choiceId.split("-")[0]]: choiceId });
    expect(next.pendingChoiceId).toBe(choiceId);

    const duplicate = applyChoice(next, choiceDefinitions[choiceId]);
    expect(duplicate).toEqual(next);
  });

  it("clamps all changed visible and hidden stats while preserving unique flags", () => {
    const extremeChoice: ChoiceDefinition = {
      id: "teen-b",
      key: "B",
      title: "边界测试",
      action: "测试上下限",
      risk: "无",
      deltas: { autonomy: -2, discernment: 8, connection: -3, security: 6, meaning: -4, publicInfluence: 7 },
      addFlags: ["已有标记", "新增标记"],
      immediateOutcome: [],
      delayedEcho: "无",
    };
    const state = {
      ...initialGameState,
      stats: { autonomy: 1, discernment: 0, connection: 2, security: 1, meaning: 3 },
      publicInfluence: 4,
      flags: ["已有标记"],
    };

    const next = applyChoice(state, extremeChoice);

    expect(next.stats).toEqual({ autonomy: 0, discernment: 5, connection: 0, security: 5, meaning: 0 });
    expect(next.publicInfluence).toBe(5);
    expect(next.flags).toEqual(["已有标记", "新增标记"]);
  });
});

describe("conditional rules", () => {
  it("wins human review with any one valid qualification", () => {
    for (const patch of [
      { stats: { ...initialGameState.stats, discernment: 4 } },
      { flags: ["查证习惯"] },
      { flags: ["决策顾问"] },
      { flags: ["AI责任倡议"] },
      { publicInfluence: 4 },
    ]) {
      expect(
        resolveConditionalFlags({
          ...initialGameState,
          ...patch,
          pendingChoiceId: "midlife-b",
        }).flags,
      ).toContain("复核胜诉");
    }
  });

  it("does not award a successful review without a qualification", () => {
    expect(
      resolveConditionalFlags(
        makeRuleState({ pendingChoiceId: "midlife-b" }),
      ).flags,
    ).not.toContain("复核胜诉");
  });

  it("normalizes the teen report into an estrangement after a bond", () => {
    const next = resolveConditionalFlags(
      makeRuleState({
        flags: ["小满羁绊", "小满关系中断"],
        pendingChoiceId: "teen-a",
      }),
    );

    expect(next.flags).toContain("小满决裂");
    expect(next.flags).not.toContain("小满关系中断");
  });

  it("normalizes the teen report into loss without a prior bond", () => {
    const next = resolveConditionalFlags(
      makeRuleState({
        flags: ["小满关系中断"],
        pendingChoiceId: "teen-a",
      }),
    );

    expect(next.flags).toContain("小满失联");
    expect(next.flags).not.toContain("小满关系中断");
  });

  it("never restores Xiaoman after signing the risk report", () => {
    expect(deriveXiaomanRelation(["小满羁绊", "小满决裂", "地下互助"])).toBe(
      "estranged",
    );
    expect(deriveXiaomanRelation(["小满失联", "小满羁绊"])).toBe("lost");
  });

  it("creates community support only with connection or underground aid", () => {
    expect(
      resolveConditionalFlags(
        makeRuleState({
          stats: { ...initialGameState.stats, connection: 3 },
          pendingChoiceId: "midlife-c",
        }),
      ).flags,
    ).toContain("社区支援");
    expect(
      resolveConditionalFlags(
        makeRuleState({ pendingChoiceId: "midlife-c" }),
      ).flags,
    ).toContain("制度惩罚");
    expect(
      resolveConditionalFlags(
        makeRuleState({
          flags: ["地下互助"],
          pendingChoiceId: "midlife-c",
        }),
      ).flags,
    ).toContain("社区支援");
  });

  it("penalizes security once when institutional punishment is created", () => {
    const punished = resolveConditionalFlags(
      makeRuleState({
        stats: { ...initialGameState.stats, security: 1 },
        pendingChoiceId: "midlife-c",
      }),
    );
    const resolvedAgain = resolveConditionalFlags(punished);

    expect(punished.stats.security).toBe(0);
    expect(resolvedAgain.stats.security).toBe(0);
  });

  it("adds real isolation in adulthood only when no Xiaoman bond exists", () => {
    expect(
      resolveConditionalFlags(
        makeRuleState({ pendingChoiceId: "adulthood-c" }),
      ).flags,
    ).toContain("现实孤立");
    expect(
      resolveConditionalFlags(
        makeRuleState({
          flags: ["小满羁绊"],
          pendingChoiceId: "adulthood-c",
        }),
      ).flags,
    ).not.toContain("现实孤立");
  });
});

describe("derived tendencies", () => {
  it.each([
    [{ stats: { autonomy: 1, discernment: 1 }, flags: ["答案依赖"] }, "guardian"],
    [{ stats: { autonomy: 3, discernment: 3 }, flags: [] }, "symbiotic"],
    [{ stats: { autonomy: 4, discernment: 2 }, flags: [] }, "tool"],
    [{ stats: { autonomy: 2, discernment: 1 }, flags: ["无植入"] }, "tool"],
  ] as const)("derives Qi tendency", (patch, expected) => {
    expect(
      deriveQiTendency(
        makeRuleState({
          flags: [...patch.flags],
          stats: { ...initialGameState.stats, ...patch.stats },
        }),
      ),
    ).toBe(expected);
  });

  it.each([
    [["复核胜诉"], 0, "co-governance"],
    [[], 4, "co-governance"],
    [["非法治疗", "社区支援"], 1, "human-limits"],
    [["非法治疗"], 4, "human-limits"],
    [["非法治疗", "制度惩罚"], 3, "social-conflict"],
    [["接受医疗判定"], 5, "tech-first"],
    [[], 1, "tech-first"],
  ] as const)(
    "derives policy from flags %j and influence %i",
    (flags, publicInfluence, expected) => {
      expect(derivePolicy({ flags: [...flags], publicInfluence })).toBe(expected);
    },
  );
});
