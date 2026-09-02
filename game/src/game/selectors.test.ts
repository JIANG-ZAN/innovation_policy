import { afterEach, describe, expect, it, vi } from "vitest";
import { choiceDefinitions } from "../content/choices";
import { createInitialGameState, initialGameState } from "./initial-state";
import type { ChoiceId, GameState } from "./model";
import { deriveEnding, deriveRemarks, selectKeyEchoes } from "./selectors";

const makeRuleState = (patch: Partial<GameState> = {}): GameState => ({
  ...createInitialGameState(),
  ...patch,
  stats: { ...createInitialGameState().stats, ...patch.stats },
});

const makeEndingState = ({
  choiceId,
  security,
  flags,
  publicInfluence,
}: {
  choiceId: ChoiceId;
  security: number;
  flags: string[];
  publicInfluence: number;
}): GameState =>
  makeRuleState({
    stageIndex: 6,
    choices: { elder: choiceId },
    stats: { ...initialGameState.stats, security },
    flags,
    publicInfluence,
  });

describe("deriveEnding", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it.each([
    ["elder-a", 4, ["精英延寿资格"], 0, "endless-node"],
    ["elder-a", 3, [], 0, "data-ghost"],
    ["elder-b", 2, ["AI责任倡议"], 4, "rule-shaper"],
    ["elder-b", 5, [], 1, "bounded-symbiosis"],
    ["elder-c", 2, ["小满羁绊"], 0, "human-warmth"],
    ["elder-c", 1, [], 0, "trace-free-exit"],
  ] as const)(
    "resolves %s route",
    (choiceId, security, flags, publicInfluence, endingId) => {
      expect(
        deriveEnding(
          makeEndingState({ choiceId, security, flags: [...flags], publicInfluence }),
        ),
      ).toBe(endingId);
    },
  );

  it.each([
    ["elder-a", 5, [], 5, "data-ghost"],
    ["elder-b", 5, ["复核胜诉"], 3, "bounded-symbiosis"],
    ["elder-c", 5, ["小满决裂", "社区支援失效"], 5, "trace-free-exit"],
  ] as const)(
    "uses the %s group default when eligibility is incomplete",
    (choiceId, security, flags, publicInfluence, endingId) => {
      expect(
        deriveEnding(
          makeEndingState({ choiceId, security, flags: [...flags], publicInfluence }),
        ),
      ).toBe(endingId);
    },
  );

  it("keeps the recorded elder choice as the terminal precedence", () => {
    expect(
      deriveEnding(
        makeEndingState({
          choiceId: "elder-c",
          security: 5,
          flags: ["精英延寿资格", "AI责任倡议", "小满羁绊"],
          publicInfluence: 5,
        }),
      ),
    ).toBe("human-warmth");
  });

  it.each([
    [["小满羁绊", "小满决裂"], "trace-free-exit"],
    [["小满羁绊", "小满失联"], "trace-free-exit"],
    [["小满羁绊"], "human-warmth"],
  ] as const)(
    "respects terminal Xiaoman relationship flags %j on the delete route",
    (flags, expected) => {
      expect(
        deriveEnding(
          makeEndingState({
            choiceId: "elder-c",
            security: 2,
            flags: [...flags],
            publicInfluence: 0,
          }),
        ),
      ).toBe(expected);
    },
  );

  it.each([
    ["elder-a", 3, [], 0, "data-ghost"],
    ["elder-b", 5, [], 1, "bounded-symbiosis"],
    ["elder-c", 1, [], 0, "trace-free-exit"],
  ] as const)(
    "warns about incomplete %s eligibility only in development",
    (choiceId, security, flags, publicInfluence, endingId) => {
      vi.stubEnv("NODE_ENV", "development");
      const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);

      expect(
        deriveEnding(
          makeEndingState({ choiceId, security, flags: [...flags], publicInfluence }),
        ),
      ).toBe(endingId);
      expect(warn).toHaveBeenCalledOnce();
    },
  );

  it("does not warn about incomplete eligibility outside development", () => {
    vi.stubEnv("NODE_ENV", "production");
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);

    expect(
      deriveEnding(
        makeEndingState({
          choiceId: "elder-a",
          security: 3,
          flags: [],
          publicInfluence: 0,
        }),
      ),
    ).toBe("data-ghost");
    expect(warn).not.toHaveBeenCalled();
  });

  it("warns about a missing final choice in development and safely falls back", () => {
    vi.stubEnv("NODE_ENV", "development");
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);

    expect(deriveEnding(makeRuleState())).toBe("trace-free-exit");
    expect(warn).toHaveBeenCalledOnce();
  });

  it("does not warn about a missing final choice outside development", () => {
    vi.stubEnv("NODE_ENV", "production");
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);

    expect(deriveEnding(makeRuleState())).toBe("trace-free-exit");
    expect(warn).not.toHaveBeenCalled();
  });
});

describe("deriveRemarks", () => {
  it("can return every earned mixed-route remark without romanticizing Xiaoman", () => {
    const remarks = deriveRemarks(
      makeRuleState({
        stats: {
          autonomy: 5,
          discernment: 5,
          connection: 1,
          security: 2,
          meaning: 1,
        },
        flags: [
          "答案依赖",
          "最优人生合同",
          "拒绝预测",
          "查证习惯",
          "人类复核",
          "昼海居民",
          "小满羁绊",
          "地下互助",
        ],
      }),
    );

    expect(remarks).toEqual([
      "未被预测的人",
      "校准者",
      "万千熟人",
      "小满在场",
    ]);
    expect(remarks.join(" ")).not.toMatch(/伴侣|恋爱/);
  });

  it("recognizes a repeatedly delegated life only at low autonomy", () => {
    expect(
      deriveRemarks(
        makeRuleState({
          stats: { ...initialGameState.stats, autonomy: 1 },
          flags: ["答案依赖", "最优人生合同"],
        }),
      ),
    ).toContain("被托管的一生");
    expect(
      deriveRemarks(
        makeRuleState({
          stats: { ...initialGameState.stats, autonomy: 2 },
          flags: ["答案依赖", "最优人生合同"],
        }),
      ),
    ).not.toContain("被托管的一生");
  });
});

describe("selectKeyEchoes", () => {
  it("returns at most three meaningful echoes in life-stage order", () => {
    const state = makeRuleState({
      choices: {
        elder: "elder-b",
        childhood: "childhood-c",
        midlife: "midlife-b",
        adulthood: "adulthood-b",
        infant: "infant-a",
      },
      flags: ["小满羁绊", "AI责任倡议", "复核胜诉", "选择边界"],
      publicInfluence: 5,
      xiaomanRelation: "bond",
      policy: "co-governance",
    });

    expect(selectKeyEchoes(state)).toEqual([
      choiceDefinitions["childhood-c"].delayedEcho,
      choiceDefinitions["adulthood-b"].delayedEcho,
      choiceDefinitions["elder-b"].delayedEcho,
    ]);
  });

  it("is deterministic for insertion order and removes duplicate entries", () => {
    const first = makeRuleState({
      choices: {
        elder: "elder-c",
        midlife: "midlife-c",
        teen: "teen-c",
        childhood: "childhood-c",
      },
      flags: ["小满羁绊", "地下互助", "社区支援", "选择删除"],
      xiaomanRelation: "strong-bond",
      policy: "human-limits",
    });
    const second = makeRuleState({
      ...first,
      choices: {
        childhood: "childhood-c",
        teen: "teen-c",
        midlife: "midlife-c",
        elder: "elder-c",
      },
    });

    const echoes = selectKeyEchoes(first);
    expect(echoes).toEqual(selectKeyEchoes(second));
    expect(echoes).toEqual([...new Set(echoes)]);
    expect(echoes).toHaveLength(3);
  });

  it("fills the archive with other life choices when fewer than three affect derivations", () => {
    const echoes = selectKeyEchoes(
      makeRuleState({
        choices: {
          infant: "infant-a",
          childhood: "childhood-a",
          youth: "youth-a",
          elder: "elder-a",
        },
      }),
    );

    expect(echoes).toEqual([
      choiceDefinitions["infant-a"].delayedEcho,
      choiceDefinitions["childhood-a"].delayedEcho,
      choiceDefinitions["elder-a"].delayedEcho,
    ]);
  });

  it.each([
    [
      {
        elder: "elder-b",
        midlife: "midlife-b",
        childhood: "childhood-b",
        infant: "infant-a",
      },
      "childhood-b",
    ],
    [
      {
        elder: "elder-b",
        midlife: "midlife-b",
        youth: "youth-b",
        infant: "infant-a",
      },
      "youth-b",
    ],
  ] as const)(
    "ranks the %s review qualification ahead of an irrelevant earlier filler",
    (choices, causalChoiceId) => {
      const echoes = selectKeyEchoes(
        makeRuleState({
          choices: { ...choices },
          flags: ["复核胜诉", "选择边界"],
          publicInfluence: 4,
          policy: "co-governance",
        }),
      );

      expect(echoes).toEqual([
        choiceDefinitions[causalChoiceId].delayedEcho,
        choiceDefinitions["midlife-b"].delayedEcho,
        choiceDefinitions["elder-b"].delayedEcho,
      ]);
    },
  );
});
