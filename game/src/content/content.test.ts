import { describe, expect, it, vi } from "vitest";
import { createInitialGameState } from "../game/initial-state";
import type { DialogueLine, GameState, QiTendency } from "../game/model";
import {
  applyChoice,
  deriveQiTendency,
  resolveConditionalFlags,
} from "../game/rules";
import { characterAssets, sceneAssets } from "./assets";
import { choiceDefinitions } from "./choices";
import { chapters, getChapter } from "./index";

const expectedChapters = [
  {
    id: "infant",
    year: 2076,
    age: 0,
    title: "婴儿期——出生协议",
    location: "海岚市安澜医院，新生儿智能监护室",
    question: "一个人尚不能同意时，谁可以替他决定未来？",
    scene: "birth",
  },
  {
    id: "childhood",
    year: 2084,
    age: 8,
    title: "幼年期——消失的鸟",
    location: "青屿学习中心及附近旧公园",
    question: "学习是获得答案，还是获得判断答案的能力？",
    scene: "learning-center",
  },
  {
    id: "teen",
    year: 2092,
    age: 16,
    title: "少年期——被预测的人",
    location: "青屿学习中心风险评估室",
    question: "当预测开始影响现实，它还是预测吗？",
    scene: "risk-room",
  },
  {
    id: "youth",
    year: 2099,
    age: 23,
    title: "青年期——94.7%的人生",
    location: "海岚市人生规划中心",
    question: "确定的幸福与不确定的自由，你更愿意承担哪一种？",
    scene: "life-planning",
  },
  {
    id: "adulthood",
    year: 2114,
    age: 38,
    title: "壮年期——最后一个工作日",
    location: "林一的工作场所、海岚市公共服务大厅、虚拟世界“昼海”",
    question: "当工作不再决定你能否活着，它是否仍决定你是谁？",
    scene: "work-service",
  },
  {
    id: "midlife",
    year: 2134,
    age: 58,
    title: "中年期——谁为正确负责",
    location: "安澜医院医疗决策室、海岚市公共听证频道",
    question: "正确的计算可以免除人的责任吗？",
    scene: "medical-room",
  },
  {
    id: "elder",
    year: 2174,
    age: 98,
    title: "老年期——余生协议",
    location: "安澜医院长寿医学中心，单人病房与门外走廊",
    question: "你作出的这些选择，是否构成了“你”？",
    scene: "longevity-room",
  },
] as const;

function lineMatchesFlags(line: DialogueLine, flags: readonly string[]): boolean {
  if (!line.when) return true;

  const { allFlags = [], anyFlags = [], noneFlags = [] } = line.when;
  return (
    allFlags.every((flag) => flags.includes(flag)) &&
    (anyFlags.length === 0 || anyFlags.some((flag) => flags.includes(flag))) &&
    noneFlags.every((flag) => !flags.includes(flag))
  );
}

function playChoices(choiceIds: readonly (keyof typeof choiceDefinitions)[]): GameState {
  return choiceIds.reduce((state, choiceId) => {
    const chosen = applyChoice(state, choiceDefinitions[choiceId]);
    return resolveConditionalFlags(chosen);
  }, createInitialGameState());
}

describe("asset manifest", () => {
  it("registers eight sourced scenes, the CSS-only day-sea mode, and approved character age sets", () => {
    expect(Object.keys(sceneAssets)).toEqual([
      "birth",
      "learning-center",
      "old-park",
      "risk-room",
      "life-planning",
      "work-service",
      "medical-room",
      "longevity-room",
      "day-sea",
    ]);
    expect(Object.values(sceneAssets).filter((asset) => asset.src !== null)).toHaveLength(8);
    expect(Object.values(sceneAssets).every((asset) => asset.fallback.includes("gradient("))).toBe(true);
    expect(sceneAssets["day-sea"]).toMatchObject({ src: null, mode: "css" });
    expect(Object.keys(characterAssets.linyi)).toHaveLength(7);
    expect(Object.keys(characterAssets.zhoulan)).toHaveLength(3);
    expect(Object.keys(characterAssets.xiaoman)).toHaveLength(5);
    expect(Object.keys(characterAssets.qi)).toHaveLength(3);
    expect(Object.values(characterAssets.xiaoman).every((path) => path.includes("xiaoman/male"))).toBe(true);
  });
});

describe("chapter registry", () => {
  it("contains the seven authoritative chapters in chronological order", () => {
    expect(chapters.map(({ id, year, age, title, location, question, scene }) => ({
      id,
      year,
      age,
      title,
      location,
      question,
      scene,
    }))).toEqual(expectedChapters);
    expect(chapters.map((chapter) => chapter.order)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(Object.isFrozen(chapters)).toBe(true);
  });

  it("uses exactly 21 unique canonical choices in A/B/C order", () => {
    const ids = chapters.flatMap((chapter) => chapter.choices.map((choice) => choice.id));
    expect(ids).toEqual([
      "infant-a", "infant-b", "infant-c",
      "childhood-a", "childhood-b", "childhood-c",
      "teen-a", "teen-b", "teen-c",
      "youth-a", "youth-b", "youth-c",
      "adulthood-a", "adulthood-b", "adulthood-c",
      "midlife-a", "midlife-b", "midlife-c",
      "elder-a", "elder-b", "elder-c",
    ]);
    expect(new Set(ids).size).toBe(21);

    for (const chapter of chapters) {
      expect(chapter.choices.map((choice) => choice.key)).toEqual(["A", "B", "C"]);
      for (const choice of chapter.choices) {
        expect(choice).toBe(choiceDefinitions[choice.id]);
      }
    }
  });

  it("resolves every scene and portrait reference and keeps readable dialogue defaults", () => {
    const portraitPaths = new Set<string>(
      Object.values(characterAssets).flatMap((ageSet) => Object.values(ageSet)),
    );

    for (const chapter of chapters) {
      expect(sceneAssets[chapter.scene as keyof typeof sceneAssets]).toBeDefined();

      for (const dialogue of [chapter.opening, chapter.closing]) {
        expect(dialogue.length).toBeGreaterThan(0);
        expect(dialogue.some((line) => !line.when)).toBe(true);

        for (const line of dialogue) {
          expect(line.text.trim()).not.toBe("");
          if (line.portrait) expect(portraitPaths.has(line.portrait)).toBe(true);
          if (line.when) {
            expect(Object.values(line.when).some((flags) => flags && flags.length > 0)).toBe(true);
          }
        }
      }
    }
  });

  it("maps choice-specific scene changes through the total asset registry", () => {
    expect(chapters[1]).toMatchObject({ choiceScenes: { C: "old-park" } });
    expect(chapters[4]).toMatchObject({ choiceScenes: { C: "day-sea" } });

    for (const chapter of chapters) {
      const choiceScenes = (chapter as unknown as {
        choiceScenes?: Partial<Record<"A" | "B" | "C", string>>;
      }).choiceScenes;
      for (const scene of Object.values(choiceScenes ?? {})) {
        expect(sceneAssets[scene as keyof typeof sceneAssets]).toBeDefined();
      }
    }
  });

  it("returns the requested chapter and safely falls back to infancy", () => {
    expect(getChapter("teen")).toBe(chapters[2]);
    expect(getChapter("not-a-stage")).toBe(chapters[0]);

    vi.stubEnv("NODE_ENV", "development");
    const warning = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    expect(getChapter("still-not-a-stage")).toBe(chapters[0]);
    expect(warning).toHaveBeenCalledWith(
      expect.stringContaining("still-not-a-stage"),
    );
    warning.mockRestore();
    vi.unstubAllEnvs();
  });

  it("does not restore Xiaoman after estrangement when community support is available", () => {
    const state = playChoices([
      "infant-c",
      "childhood-c",
      "teen-a",
      "youth-c",
      "adulthood-b",
      "midlife-c",
    ]);
    const visibleClosing = getChapter("midlife").closing.filter((line) =>
      lineMatchesFlags(line, state.flags),
    );

    expect(state.flags).toEqual(
      expect.arrayContaining(["小满决裂", "社区支援", "非法治疗"]),
    );
    expect(visibleClosing.some((line) => line.speaker === "小满")).toBe(false);
    expect(visibleClosing).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          speaker: "社区成员",
          text: expect.stringContaining("旧友网络"),
        }),
      ]),
    );
  });

  it.each([
    [
      "guardian",
      { autonomy: 1, discernment: 1, security: 4 },
      ["答案依赖", "选择删除"],
      "“栖”第一次表现出近似恐惧的停顿。",
    ],
    [
      "symbiotic",
      { autonomy: 3, discernment: 3, security: 2 },
      ["选择删除"],
      "我将执行你的边界。",
    ],
    [
      "tool",
      { autonomy: 2, discernment: 1, security: 2 },
      ["无植入", "选择删除"],
      "我的任务到此结束。",
    ],
  ] as const)(
    "maps elder C's %s Qi tendency to its authoritative response",
    (expectedTendency, stats, flags, expectedText) => {
      const state = {
        ...createInitialGameState(),
        stats: { ...createInitialGameState().stats, ...stats },
        flags: [...flags],
      };
      const qiTendency = deriveQiTendency(state);
      const matchingLines = getChapter("elder").closing.filter((line) => {
        const when = line.when as
          | (NonNullable<DialogueLine["when"]> & {
              qiTendency?: QiTendency | QiTendency[];
            })
          | undefined;
        const tendencies = when?.qiTendency
          ? Array.isArray(when.qiTendency)
            ? when.qiTendency
            : [when.qiTendency]
          : [];
        return tendencies.includes(qiTendency);
      });

      expect(qiTendency).toBe(expectedTendency);
      expect(matchingLines).toHaveLength(1);
      expect(matchingLines[0]).toMatchObject({
        text: expectedText,
        when: { allFlags: ["选择删除"], qiTendency: expectedTendency },
      });
    },
  );

  it("maps every youth B history to the authoritative conditional outcome", () => {
    const youth = getChapter("youth");

    expect(youth.closing).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          text: expect.stringContaining("公共奖学金"),
          when: { allFlags: ["决策顾问", "公开申诉"] },
        }),
        expect.objectContaining({
          text: expect.stringContaining("证据缺口"),
          when: { allFlags: ["决策顾问", "查证习惯"] },
        }),
        expect.objectContaining({
          text: expect.stringContaining("学生贷款"),
          when: {
            allFlags: ["决策顾问"],
            noneFlags: ["公开申诉", "查证习惯"],
          },
        }),
      ]),
    );
  });

  it("shows youth A history echoes only after the contract is accepted", () => {
    const youth = getChapter("youth");
    const historyFlags = ["制度信任", "地下互助"];

    expect(
      youth.opening.some((line) =>
        line.when?.allFlags?.some((flag) => historyFlags.includes(flag)),
      ),
    ).toBe(false);
    expect(youth.closing).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          text: expect.stringContaining("历次选择与最优路线高度一致"),
          when: { allFlags: ["最优人生合同", "制度信任"] },
        }),
        expect.objectContaining({
          text: expect.stringContaining("补充数据协议"),
          when: { allFlags: ["最优人生合同", "地下互助"] },
        }),
      ]),
    );
  });

  it("maps adulthood A and B outcomes to contract, underground, and all three career histories", () => {
    const closing = getChapter("adulthood").closing;
    const expectedConditions = [
      ["平台管理者", "最优人生合同"],
      ["平台管理者", "地下互助"],
      ["公共服务", "决策顾问"],
      ["公共服务", "社区工作者"],
      ["公共服务", "人格设计师"],
    ];

    for (const allFlags of expectedConditions) {
      expect(
        closing.some(
          (line) =>
            line.when?.allFlags?.length === allFlags.length &&
            allFlags.every((flag) => line.when?.allFlags?.includes(flag)),
        ),
      ).toBe(true);
    }
  });

  it("keeps youth and midlife epilogue micro-responses as non-persistent neutral narration", () => {
    const youthPrompt = getChapter("youth").closing.find(
      (line) => line.id === "youth-closing-answer",
    );
    const adulthoodPrompt = getChapter("adulthood").closing.find(
      (line) => line.id === "adulthood-closing-call",
    );
    const midlifePrompt = getChapter("midlife").closing.find(
      (line) => line.id === "midlife-closing-boundary-review",
    );

    expect(youthPrompt?.text).toContain("三种未定回答并列停留");
    expect(adulthoodPrompt?.text).toContain("两个未定画面并列停留");
    expect(midlifePrompt?.text).toContain("只作为一个未决问题");
    expect(midlifePrompt?.text).toContain("不作为后续已发生的事实");

    const allConditionFlags = chapters.flatMap((chapter) =>
      [...chapter.opening, ...chapter.closing].flatMap((line) => [
        ...(line.when?.allFlags ?? []),
        ...(line.when?.anyFlags ?? []),
        ...(line.when?.noneFlags ?? []),
      ]),
    );
    expect(allConditionFlags).not.toEqual(
      expect.arrayContaining([
        "青年回答机会",
        "青年回答失去",
        "青年回答母亲选择",
        "接听周岚",
        "生成互动人格",
        "仅保留语音档案",
      ]),
    );
  });

  it("keeps the three midlife digital-person epilogues route-consistent", () => {
    const acceptedRoute = [
      "infant-a",
      "childhood-a",
      "teen-a",
      "youth-a",
      "adulthood-a",
      "midlife-a",
    ] as const;
    const reviewedRoute = [
      "infant-b",
      "childhood-b",
      "teen-b",
      "youth-b",
      "adulthood-b",
      "midlife-b",
    ] as const;
    const illegalRoute = [
      "infant-c",
      "childhood-c",
      "teen-c",
      "youth-c",
      "adulthood-c",
      "midlife-c",
    ] as const;
    const visibleClosingFor = (
      route: readonly (keyof typeof choiceDefinitions)[],
    ) => {
      expect(route).toHaveLength(6);
      const state = playChoices(route);
      return {
        flags: state.flags,
        choices: state.choices,
        text: getChapter("midlife").closing
          .filter((line) => lineMatchesFlags(line, state.flags))
          .map((line) => line.text)
          .join("\n"),
      };
    };

    const accepted = visibleClosingFor(acceptedRoute);
    expect(accepted.choices).toEqual({
      infant: "infant-a",
      childhood: "childhood-a",
      teen: "teen-a",
      youth: "youth-a",
      adulthood: "adulthood-a",
      midlife: "midlife-a",
    });
    expect(accepted.flags).toEqual(
      expect.arrayContaining(["接受医疗判定", "数字周岚"]),
    );
    expect(accepted.text).toContain("系统已默认生成数字周岚");
    expect(accepted.text).not.toContain("两种未定可能");
    expect(accepted.text).not.toContain("不要让一个模型替我继续当你的母亲");

    const reviewed = visibleClosingFor(reviewedRoute);
    expect(reviewed.choices).toEqual({
      infant: "infant-b",
      childhood: "childhood-b",
      teen: "teen-b",
      youth: "youth-b",
      adulthood: "adulthood-b",
      midlife: "midlife-b",
    });
    expect(reviewed.flags).toContain("人类复核");
    expect(reviewed.text).toContain("一个未决问题");
    expect(reviewed.text).toContain(
      "是否采用“只保留语音档案、不生成互动人格”这个组合方案",
    );
    expect(reviewed.text).not.toContain("两种未定可能");
    expect(reviewed.text).not.toContain("已经采用");
    expect(reviewed.text).not.toContain("系统已默认生成数字周岚");
    expect(reviewed.text).not.toContain("不要让一个模型替我继续当你的母亲");

    const illegal = visibleClosingFor(illegalRoute);
    expect(illegal.choices).toEqual({
      infant: "infant-c",
      childhood: "childhood-c",
      teen: "teen-c",
      youth: "youth-c",
      adulthood: "adulthood-c",
      midlife: "midlife-c",
    });
    expect(illegal.flags).toContain("非法治疗");
    expect(illegal.text).toContain("不要让一个模型替我继续当你的母亲");
    expect(illegal.text).toContain("尚未说明林一是否遵从");
    expect(illegal.text).not.toContain("系统已默认生成数字周岚");
    expect(illegal.text).not.toContain("一个未决问题");
  });

  it("makes both teen B evidence outcomes explicit and mutually exclusive", () => {
    const closing = getChapter("teen").closing;
    const successLines = closing.filter((line) =>
      lineMatchesFlags(line, ["公开申诉", "查证习惯"]),
    );
    const failureLines = closing.filter((line) =>
      lineMatchesFlags(line, ["公开申诉"]),
    );

    expect(successLines).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          text: expect.stringMatching(/撤销小满的风险标签.*训练数据审查/),
          when: { allFlags: ["公开申诉", "查证习惯"] },
        }),
      ]),
    );
    expect(failureLines).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          text: expect.stringMatching(/原风险评估维持.*公开听证/),
          when: {
            allFlags: ["公开申诉"],
            noneFlags: ["查证习惯"],
          },
        }),
      ]),
    );
    expect(
      successLines.some((line) => line.text.includes("原风险评估维持")),
    ).toBe(false);
    expect(
      failureLines.some((line) => line.text.includes("撤销小满的风险标签")),
    ).toBe(false);
  });
});
