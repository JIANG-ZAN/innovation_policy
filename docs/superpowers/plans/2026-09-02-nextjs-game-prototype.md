# 《余生协议》Next.js 游戏原型 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 `game/` 中实现一个无需后端、账号、持久化或音频，可从标题页完整游玩七个人生阶段并进入六种结局之一的 Next.js 互动叙事演示。

**Architecture:** 应用采用 Next.js App Router 和单页客户端游戏外壳，顶层 `useReducer` 保存一次会话的全部内存状态。内容层以类型安全的章节数据承载剧本，规则层以纯函数处理状态、标记、关系、政策和结局，表现层只负责场景、对白、选择、档案与动画，不在组件中硬编码分支判断。

**Tech Stack:** Next.js App Router、React、TypeScript、CSS Modules、Vitest、Testing Library、Playwright。

**Spec:** `docs/superpowers/specs/2026-09-02-nextjs-game-prototype-design.md`

## Global Constraints

- 工程目录固定为 `game/`；原始剧本、设计文档和图片继续保留在工程目录之外。
- 不创建后端、数据库、API 路由、登录、注册、账号或云存档。
- 不使用 `localStorage`、Cookie 或任何持久化；刷新页面必须回到标题页。
- 不加入配音、音乐、环境音、音频控制、视频、动态 PPT 或 Canvas 引擎。
- 动画仅使用 CSS transition、keyframes 和浏览器原生能力，不安装 React 动画库。
- 所有状态值统一限制在 0—5；五项可见状态为自主、辨识、联结、保障、意义，公共影响力保持隐藏。
- 小满始终为男性终身朋友，所有文案使用男性指代，不自动生成恋爱关系。
- “栖”不是反派；它的越界来自授权、效率目标或制度默认。
- `剧本/01-婴儿期.md` 至 `剧本/08-结局.md` 是叙事唯一来源，`剧本/09-分支变量与回响.md` 是规则唯一来源。
- 当前目录不是 Git 仓库，因此不执行 `git commit`；每项任务以其测试命令通过作为版本检查点。

---

## File Map

```text
game/
├── package.json                         # 脚本与依赖
├── next.config.ts                       # Next.js 配置
├── playwright.config.ts                 # 浏览器验收配置
├── vitest.config.ts                     # 单元/组件测试配置
├── public/assets/
│   ├── scenes/01-birth.png ... 08-longevity.png
│   └── characters/{linyi,zhoulan,xiaoman,qi}/...
├── e2e/
│   ├── full-life.spec.ts                # 三条代表路线与六结局可达性
│   ├── responsive.spec.ts               # 桌面/平板/手机与降动效
│   └── reset.spec.ts                    # 刷新和重新开始
└── src/
    ├── app/
    │   ├── layout.tsx                   # 元数据与全局样式
    │   ├── page.tsx                     # 客户端游戏入口
    │   └── globals.css                  # 颜色、排版、动画变量、降动效
    ├── game/
    │   ├── model.ts                     # 共享类型与 ID 联合类型
    │   ├── initial-state.ts             # 单一初始会话
    │   ├── reducer.ts                   # 有限动作状态机
    │   ├── reducer.test.ts
    │   ├── rules.ts                     # clamp、选择应用、派生与结局纯函数
    │   ├── rules.test.ts
    │   ├── selectors.ts                 # 当前章节/节点/状态侧写选择器
    │   └── selectors.test.ts
    ├── content/
    │   ├── assets.ts                    # 背景与年龄立绘映射
    │   ├── choices.ts                   # 21 项规则效果
    │   ├── chapters/
    │   │   ├── infant.ts
    │   │   ├── childhood.ts
    │   │   ├── teen.ts
    │   │   ├── youth.ts
    │   │   ├── adulthood.ts
    │   │   ├── midlife.ts
    │   │   └── elder.ts
    │   ├── endings.ts                   # 六结局与五种附加评语
    │   ├── index.ts                     # 内容注册表
    │   └── content.test.ts              # 数据完整性与引用检查
    ├── components/
    │   ├── GameApp.tsx                  # useReducer 与主屏幕路由
    │   ├── GameApp.test.tsx
    │   ├── TitleScreen.tsx
    │   ├── GameShell.tsx
    │   ├── StoryScene.tsx
    │   ├── DialoguePanel.tsx
    │   ├── DialoguePanel.test.tsx
    │   ├── ChoicePanel.tsx
    │   ├── ChoicePanel.test.tsx
    │   ├── OutcomePanel.tsx
    │   ├── LifeHud.tsx
    │   ├── LifeArchive.tsx
    │   ├── EndingScreen.tsx
    │   ├── StageTransition.tsx
    │   ├── SafeImage.tsx
    │   └── *.module.css                  # 各组件局部样式
    └── test/
        └── setup.ts                      # jest-dom 与测试清理
```

## Core Interfaces

所有任务必须沿用下列命名，不在后续任务另造同义接口。

```ts
export type StageId =
  | "infant" | "childhood" | "teen" | "youth"
  | "adulthood" | "midlife" | "elder";
export type ChoiceKey = "A" | "B" | "C";
export type ChoiceId = `${StageId}-${Lowercase<ChoiceKey>}`;
export type StatKey = "autonomy" | "discernment" | "connection" | "security" | "meaning";
export type Screen = "title" | "story" | "choice" | "outcome" | "archive" | "ending";
export type XiaomanRelation = "unmet" | "acquaintance" | "bond" | "strong-bond" | "estranged" | "lost";
export type QiTendency = "guardian" | "symbiotic" | "tool";
export type PolicyEnvironment = "tech-first" | "co-governance" | "human-limits" | "social-conflict";
export type EndingId = "endless-node" | "data-ghost" | "rule-shaper" | "bounded-symbiosis" | "human-warmth" | "trace-free-exit";

export interface Stats {
  autonomy: number;
  discernment: number;
  connection: number;
  security: number;
  meaning: number;
}

export interface ChoiceDefinition {
  id: ChoiceId;
  key: ChoiceKey;
  title: string;
  action: string;
  risk: string;
  deltas: Partial<Record<StatKey | "publicInfluence", number>>;
  addFlags: string[];
  immediateOutcome: string[];
  delayedEcho: string;
}

export interface DialogueLine {
  id: string;
  speaker: string;
  text: string;
  portrait?: string;
  when?: { allFlags?: string[]; anyFlags?: string[]; noneFlags?: string[] };
}

export interface ChapterDefinition {
  id: StageId;
  order: number;
  year: number;
  age: number;
  title: string;
  location: string;
  question: string;
  scene: string;
  cast: string[];
  opening: DialogueLine[];
  choices: [ChoiceDefinition, ChoiceDefinition, ChoiceDefinition];
  closing: DialogueLine[];
}

export interface GameState {
  screen: Screen;
  stageIndex: number;
  dialogueIndex: number;
  stats: Stats;
  publicInfluence: number;
  flags: string[];
  choices: Partial<Record<StageId, ChoiceId>>;
  xiaomanRelation: XiaomanRelation;
  qiTendency: QiTendency;
  policy: PolicyEnvironment;
  pendingChoiceId: ChoiceId | null;
  endingId: EndingId | null;
}
```

---

### Task 1: Scaffold the App, Test Harness, and Asset Boundary

**Files:**
- Create: `game/` via `create-next-app`
- Modify: `game/package.json`
- Create: `game/vitest.config.ts`
- Create: `game/src/test/setup.ts`
- Create: `game/playwright.config.ts`
- Create: `game/src/content/assets.ts`
- Create: `game/src/content/content.test.ts`
- Copy: selected files from `素材/` to `game/public/assets/`

**Interfaces:**
- Consumes: eight approved scene PNGs and individual transparent character PNGs.
- Produces: `sceneAssets`, `characterAssets`, `npm test`, `npm run test:e2e`, and a runnable Next.js shell.

- [ ] **Step 1: Verify the local runtime and scaffold without touching source documents**

Run:

```bash
node --version
npm --version
npx create-next-app@latest game --ts --eslint --app --src-dir --import-alias '@/*' --use-npm --no-tailwind --yes
```

Expected: `game/package.json` exists and `npm run build` succeeds inside `game/`.

- [ ] **Step 2: Install only the testing dependencies**

Run:

```bash
cd game
npm install --save-dev vitest jsdom @vitejs/plugin-react @testing-library/react @testing-library/jest-dom @testing-library/user-event @playwright/test
npx playwright install chromium
```

Add these scripts to `package.json`:

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "check": "npm run lint && npm test && npm run build"
  }
}
```

- [ ] **Step 3: Configure Vitest and Playwright**

Create `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: { environment: "jsdom", setupFiles: ["./src/test/setup.ts"], css: true },
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
});
```

Create `src/test/setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

Create `playwright.config.ts` with `testDir: "./e2e"`, `baseURL: "http://127.0.0.1:3000"`, Chromium only, and a `webServer` command of `npm run dev -- --hostname 127.0.0.1` with `reuseExistingServer: true`.

Set `next.config.ts` to `output: "export"` and `images: { unoptimized: true }`, so `npm run build` produces a self-contained `out/` directory and does not require a Next.js image-optimization service at runtime.

- [ ] **Step 4: Copy only approved runtime assets**

Copy the eight `*-v1.png` scene files to `public/assets/scenes/` using English runtime names `01-birth.png` through `08-longevity.png`. Copy all independent 林一 ages, three 周岚 ages, five files from `小满-男-v2/`, and three 栖 states into character subfolders. Do not copy composite sheets, chroma-key sources, prompt Markdown, or the deprecated female 小满 set.

- [ ] **Step 5: Write the failing asset-manifest test**

```ts
import { describe, expect, it } from "vitest";
import { characterAssets, sceneAssets } from "./assets";

describe("asset manifest", () => {
  it("registers all eight scenes and approved character age sets", () => {
    expect(Object.keys(sceneAssets)).toHaveLength(8);
    expect(Object.keys(characterAssets.linyi)).toHaveLength(7);
    expect(Object.keys(characterAssets.zhoulan)).toHaveLength(3);
    expect(Object.keys(characterAssets.xiaoman)).toHaveLength(5);
    expect(Object.keys(characterAssets.qi)).toHaveLength(3);
    expect(Object.values(characterAssets.xiaoman).every((path) => path.includes("xiaoman/male"))).toBe(true);
  });
});
```

- [ ] **Step 6: Run the test, add the manifest, and verify the checkpoint**

Run `npm test -- src/content/content.test.ts`; expect failure because `assets.ts` does not exist. Add literal path maps in `assets.ts`, rerun the test, then run `npm run lint && npm run build`; all must pass.

---

### Task 2: Define the Domain Model and Initial In-Memory Session

**Files:**
- Create: `game/src/game/model.ts`
- Create: `game/src/game/initial-state.ts`
- Create: `game/src/game/reducer.ts`
- Create: `game/src/game/reducer.test.ts`

**Interfaces:**
- Consumes: the Core Interfaces in this plan.
- Produces: `initialGameState`, `GameAction`, and `gameReducer(state, action): GameState`.

- [ ] **Step 1: Write initial-state and navigation tests**

```ts
import { describe, expect, it } from "vitest";
import { initialGameState } from "./initial-state";
import { gameReducer } from "./reducer";

describe("gameReducer", () => {
  it("starts one fresh life without persisted state", () => {
    expect(initialGameState).toMatchObject({
      screen: "title",
      stageIndex: 0,
      dialogueIndex: 0,
      stats: { autonomy: 2, discernment: 1, connection: 1, security: 2, meaning: 1 },
      publicInfluence: 0,
      flags: [],
      choices: {},
      xiaomanRelation: "unmet",
      pendingChoiceId: null,
      endingId: null,
    });
  });

  it("starts and resets by returning independent initial objects", () => {
    const started = gameReducer(initialGameState, { type: "START_GAME" });
    expect(started.screen).toBe("story");
    const reset = gameReducer(started, { type: "RESET_GAME" });
    expect(reset).toEqual(initialGameState);
    expect(reset).not.toBe(initialGameState);
  });
});
```

- [ ] **Step 2: Run the test and confirm the expected import failure**

Run: `npm test -- src/game/reducer.test.ts`

Expected: FAIL because the model, initial state, and reducer are not defined.

- [ ] **Step 3: Implement the model, initial state, and finite action union**

Define the Core Interfaces plus this action union in `model.ts`:

```ts
export type GameAction =
  | { type: "START_GAME" }
  | { type: "ADVANCE_DIALOGUE"; lineCount: number }
  | { type: "OPEN_CHOICES" }
  | { type: "SUBMIT_CHOICE"; choiceId: ChoiceId }
  | { type: "SHOW_OUTCOME" }
  | { type: "OPEN_ARCHIVE" }
  | { type: "ADVANCE_STAGE" }
  | { type: "RESET_GAME" };
```

`initial-state.ts` exports a factory `createInitialGameState()` and `initialGameState`. The reducer must use the factory for reset so arrays and objects are not shared. Do not read from storage or URL parameters.

- [ ] **Step 4: Implement minimal screen navigation and verify**

Implement `START_GAME`, `ADVANCE_DIALOGUE`, `OPEN_CHOICES`, `SHOW_OUTCOME`, `OPEN_ARCHIVE`, and `RESET_GAME`. Leave `SUBMIT_CHOICE` and `ADVANCE_STAGE` returning unchanged state until their tested tasks. Run `npm test -- src/game/reducer.test.ts`; expect PASS.

---

### Task 3: Encode All 21 Choice Effects and Guard the Reducer

**Files:**
- Create: `game/src/content/choices.ts`
- Create: `game/src/game/rules.ts`
- Create: `game/src/game/rules.test.ts`
- Modify: `game/src/game/reducer.ts`
- Modify: `game/src/game/reducer.test.ts`

**Interfaces:**
- Consumes: `GameState`, `ChoiceDefinition`, and 21 choice rows from `剧本/09-分支变量与回响.md`.
- Produces: `clampStat(value): number`, `applyChoice(state, choice): GameState`, and `choiceDefinitions: Record<ChoiceId, ChoiceDefinition>`.

- [ ] **Step 1: Write failing clamp, 21-choice, and duplicate-submission tests**

```ts
it("keeps every visible and hidden stat between zero and five", () => {
  expect(clampStat(-3)).toBe(0);
  expect(clampStat(3)).toBe(3);
  expect(clampStat(9)).toBe(5);
});

it.each([
  ["infant-a", { autonomy: 1, discernment: 2, security: 4 }, ["全量芯片", "终身数据授权"]],
  ["infant-b", { autonomy: 3, discernment: 2, security: 3 }, ["监护型芯片", "人类确认权"]],
  ["infant-c", { autonomy: 4, connection: 2, security: 1 }, ["无植入", "个人数据权"]],
] as const)("applies %s exactly once", (choiceId, expectedStats, flags) => {
  const next = applyChoice(initialGameState, choiceDefinitions[choiceId]);
  expect(next.stats).toMatchObject(expectedStats);
  expect(next.flags).toEqual(expect.arrayContaining(flags));
  const duplicate = applyChoice(next, choiceDefinitions[choiceId]);
  expect(duplicate).toEqual(next);
});
```

Add table-driven cases for all remaining IDs with the exact deltas below:

| IDs | Deltas |
|---|---|
| `childhood-a/b/c` | `discernment-1 security+1 meaning-1` / `autonomy+1 discernment+2 meaning+1` / `connection+2 meaning+1` |
| `teen-a/b/c` | `autonomy-1 connection-2 security+2` / `discernment+1 connection+1 meaning+1 publicInfluence+2` / `autonomy+1 connection+2 security-1 publicInfluence+1` |
| `youth-a/b/c` | `autonomy-1 security+2` / `discernment+1 meaning+2 publicInfluence+1` / `autonomy+2 connection+1 meaning+1 security-1` |
| `adulthood-a/b/c` | `autonomy-1 connection-1 security+2` / `connection+1 meaning+2 publicInfluence+2` / `security+1 connection-2 meaning+1` |
| `midlife-a/b/c` | `autonomy-1 security+1 meaning-2` / `autonomy+1 security-1 publicInfluence+2` / `autonomy+2 security-2 publicInfluence+1` |
| `elder-a/b/c` | no score deltas; add final-choice flag only |

- [ ] **Step 2: Run the tests and confirm they fail**

Run: `npm test -- src/game/rules.test.ts src/game/reducer.test.ts`

Expected: FAIL because `choices.ts`, `clampStat`, and `applyChoice` do not exist.

- [ ] **Step 3: Add the complete literal choice map**

Use IDs `infant-a` through `elder-c`. Copy each title, action, risk, immediate outcome, delayed echo, and flags from the corresponding stage Markdown. The exact flag sets are:

```ts
{
  "infant-a": ["全量芯片", "终身数据授权"],
  "infant-b": ["监护型芯片", "人类确认权"],
  "infant-c": ["无植入", "个人数据权"],
  "childhood-a": ["答案依赖"],
  "childhood-b": ["查证习惯"],
  "childhood-c": ["小满羁绊", "线下协作"],
  "teen-a": ["制度信任", "小满关系中断"],
  "teen-b": ["公开申诉"],
  "teen-c": ["地下互助", "小满羁绊"],
  "youth-a": ["最优人生合同", "人格设计师"],
  "youth-b": ["决策顾问", "人类责任"],
  "youth-c": ["拒绝预测", "社区工作者"],
  "adulthood-a": ["平台管理者", "精英延寿资格"],
  "adulthood-b": ["公共服务", "AI责任倡议"],
  "adulthood-c": ["昼海居民"],
  "midlife-a": ["接受医疗判定", "数字周岚"],
  "midlife-b": ["人类复核"],
  "midlife-c": ["非法治疗"],
  "elder-a": ["选择永生"],
  "elder-b": ["选择边界"],
  "elder-c": ["选择删除"]
} as const;
```

- [ ] **Step 4: Implement immutable choice application**

`applyChoice` must reject an ID whose stage already appears in `state.choices`, clamp all six stats, deduplicate flags, set `pendingChoiceId`, and record the choice under its stage. It must not infer relationship, policy, or ending yet.

- [ ] **Step 5: Connect reducer submission and verify the checkpoint**

`SUBMIT_CHOICE` looks up `choiceDefinitions[action.choiceId]`, verifies the choice belongs to the current stage and `screen === "choice"`, calls `applyChoice`, and moves to `outcome`. Run `npm test -- src/game/rules.test.ts src/game/reducer.test.ts`; expect all 21 cases and duplicate-click cases to pass.

---

### Task 4: Implement Conditional Echoes, Relationships, Policy, Qi, and Six Endings

**Files:**
- Modify: `game/src/game/rules.ts`
- Modify: `game/src/game/rules.test.ts`
- Create: `game/src/content/endings.ts`
- Create: `game/src/game/selectors.ts`
- Create: `game/src/game/selectors.test.ts`

**Interfaces:**
- Consumes: a choice-applied `GameState`.
- Produces: the following exact pure-function signatures.

```ts
resolveConditionalFlags(state: GameState): GameState;
deriveXiaomanRelation(flags: readonly string[]): XiaomanRelation;
deriveQiTendency(state: Pick<GameState, "stats" | "flags">): QiTendency;
derivePolicy(state: Pick<GameState, "flags" | "publicInfluence">): PolicyEnvironment;
deriveEnding(state: GameState): EndingId;
deriveRemarks(state: GameState): string[];
selectKeyEchoes(state: GameState): string[];
```

- [ ] **Step 1: Write failing tests for conditional rules**

Cover these exact cases:

```ts
const makeRuleState = (patch: Partial<GameState> = {}): GameState => ({
  ...createInitialGameState(),
  ...patch,
  stats: { ...createInitialGameState().stats, ...patch.stats },
});

it("wins human review with any one valid qualification", () => {
  for (const patch of [
    { stats: { ...initialGameState.stats, discernment: 4 } },
    { flags: ["查证习惯"] },
    { flags: ["决策顾问"] },
    { flags: ["AI责任倡议"] },
    { publicInfluence: 4 },
  ]) {
    expect(resolveConditionalFlags({ ...initialGameState, ...patch, pendingChoiceId: "midlife-b" }).flags)
      .toContain("复核胜诉");
  }
});

it("never restores Xiaoman after signing the risk report", () => {
  expect(deriveXiaomanRelation(["小满羁绊", "小满决裂", "地下互助"])).toBe("estranged");
  expect(deriveXiaomanRelation(["小满失联", "小满羁绊"])).toBe("lost");
});

it("creates community support only with connection or underground aid", () => {
  expect(resolveConditionalFlags(makeRuleState({ stats: { ...initialGameState.stats, connection: 3 }, pendingChoiceId: "midlife-c" })).flags).toContain("社区支援");
  expect(resolveConditionalFlags(makeRuleState({ pendingChoiceId: "midlife-c" })).flags).toContain("制度惩罚");
});
```

- [ ] **Step 2: Write failing table tests for Qi and policy**

```ts
it.each([
  [{ stats: { autonomy: 1, discernment: 1 }, flags: ["答案依赖"] }, "guardian"],
  [{ stats: { autonomy: 3, discernment: 3 }, flags: [] }, "symbiotic"],
  [{ stats: { autonomy: 4, discernment: 2 }, flags: [] }, "tool"],
  [{ stats: { autonomy: 2, discernment: 1 }, flags: ["无植入"] }, "tool"],
] as const)("derives Qi tendency", (patch, expected) => {
  expect(deriveQiTendency(makeRuleState({
    flags: [...patch.flags],
    stats: { ...initialGameState.stats, ...patch.stats },
  }))).toBe(expected);
});
```

Policy tests must prove all four outputs: successful review or influence 4 → `co-governance`; illegal treatment plus support/high influence → `human-limits`; illegal treatment without them → `social-conflict`; accepted medical decision or low influence default → `tech-first`.

- [ ] **Step 3: Write failing table tests for all six endings**

```ts
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
}): GameState => makeRuleState({
  stageIndex: 6,
  choices: { elder: choiceId },
  stats: { ...initialGameState.stats, security },
  flags,
  publicInfluence,
});

it.each([
  ["elder-a", 4, ["精英延寿资格"], 0, "endless-node"],
  ["elder-a", 3, [], 0, "data-ghost"],
  ["elder-b", 2, ["AI责任倡议"], 4, "rule-shaper"],
  ["elder-b", 5, [], 1, "bounded-symbiosis"],
  ["elder-c", 2, ["小满羁绊"], 0, "human-warmth"],
  ["elder-c", 1, [], 0, "trace-free-exit"],
] as const)("resolves %s route", (choiceId, security, flags, publicInfluence, endingId) => {
  expect(deriveEnding(makeEndingState({ choiceId, security, flags, publicInfluence }))).toBe(endingId);
});
```

Also test the safe fallback: an invalid/missing eligibility combination within each final-choice group returns that group’s default (`data-ghost`, `bounded-symbiosis`, or `trace-free-exit`) and calls `console.warn` only when `process.env.NODE_ENV === "development"`.

- [ ] **Step 4: Run the tests and confirm the missing-rule failures**

Run: `npm test -- src/game/rules.test.ts src/game/selectors.test.ts`

- [ ] **Step 5: Implement pure derivation functions in precedence order**

Use the exact precedence from `剧本/09-分支变量与回响.md`. After every submitted choice, reducer state stores freshly derived `xiaomanRelation`, `qiTendency`, and `policy`. Conditional flags are applied before derivations. `teen-a` converts `小满关系中断` into `小满决裂` when a prior bond exists, otherwise into `小满失联`; both remain terminal and later flags cannot silently restore the friendship. For `adulthood-c`, add `现实孤立` only if no bond exists. For `midlife-c`, apply an extra security decrement for `制度惩罚` at the point the flag is created, clamped to zero.

- [ ] **Step 6: Encode ending copy and remarks**

`endings.ts` exports six objects with exact title, narrative paragraphs, last line, and question from `剧本/08-结局.md`. `deriveRemarks` supports `被托管的一生`, `未被预测的人`, `校准者`, `万千熟人`, and `小满在场`; it may return multiple remarks, but must never label 小满 as a partner.

- [ ] **Step 7: Select three meaningful delayed echoes and verify**

`selectKeyEchoes(state)` returns at most three unique entries, ordered earliest-to-latest, preferring choices whose flags affect the ending, policy, or Xiaoman’s presence. Add deterministic tests, then run all game tests; expect PASS.

---

### Task 5: Transcribe and Validate the Seven Chapters

**Files:**
- Create: `game/src/content/chapters/infant.ts`
- Create: `game/src/content/chapters/childhood.ts`
- Create: `game/src/content/chapters/teen.ts`
- Create: `game/src/content/chapters/youth.ts`
- Create: `game/src/content/chapters/adulthood.ts`
- Create: `game/src/content/chapters/midlife.ts`
- Create: `game/src/content/chapters/elder.ts`
- Create: `game/src/content/index.ts`
- Modify: `game/src/content/content.test.ts`

**Interfaces:**
- Consumes: chapter Markdown files and `choiceDefinitions`.
- Produces: `chapters: readonly ChapterDefinition[]`, `getChapter(stageId)`, and fully validated references.

- [ ] **Step 1: Write a failing content-contract test**

```ts
describe("chapter registry", () => {
  it("contains seven ordered chapters and exactly 21 unique choices", () => {
    expect(chapters.map((chapter) => chapter.id)).toEqual([
      "infant", "childhood", "teen", "youth", "adulthood", "midlife", "elder",
    ]);
    const ids = chapters.flatMap((chapter) => chapter.choices.map((choice) => choice.id));
    expect(ids).toHaveLength(21);
    expect(new Set(ids).size).toBe(21);
  });

  it("provides safe defaults for every conditional dialogue set", () => {
    for (const chapter of chapters) {
      expect(chapter.opening.some((line) => !line.when)).toBe(true);
      expect(chapter.closing.some((line) => !line.when)).toBe(true);
      expect(sceneAssets[chapter.scene]).toBeDefined();
    }
  });
});
```

Add assertions for years `[2076, 2084, 2092, 2099, 2114, 2134, 2174]`, ages `[0, 8, 16, 23, 38, 58, 98]`, non-empty question/location, and three choices in A/B/C order.

- [ ] **Step 2: Run the contract test and confirm it fails**

Run: `npm test -- src/content/content.test.ts`

- [ ] **Step 3: Transcribe one authoritative Markdown file per chapter**

Map the sources exactly:

| Runtime file | Source | Scene |
|---|---|---|
| `infant.ts` | `剧本/01-婴儿期.md` | `birth` |
| `childhood.ts` | `剧本/02-幼年期.md` | `learning-center`, conditionally `old-park` |
| `teen.ts` | `剧本/03-少年期.md` | `risk-room` |
| `youth.ts` | `剧本/04-青年期.md` | `life-planning` |
| `adulthood.ts` | `剧本/05-壮年期.md` | `work-service`, with CSS-only `day-sea` overlay after C |
| `midlife.ts` | `剧本/06-中年期.md` | `medical-room` |
| `elder.ts` | `剧本/07-老年期.md` | `longevity-room` |

Split long narrative paragraphs only at sentence boundaries. Preserve every choice’s meaning, benefit, cost, immediate outcome, and delayed echo. Model precondition differences with `DialogueLine.when`; always include an unconditional fallback line. Use `他` for every 小满 reference.

- [ ] **Step 4: Register chapters and make asset references total**

Export a frozen array sorted by `order`. Add `getChapter(stageId)` that returns the matching chapter or the infant chapter as a safe fallback while warning in development. `assets.ts` must include a gradient fallback for each scene key and the generated `day-sea` CSS mode, not a missing image path.

- [ ] **Step 5: Run content and type checks**

Run `npm test -- src/content/content.test.ts && npm run lint && npx tsc --noEmit`; all tests and checks must pass.

---

### Task 6: Build the Title Screen, Game Shell, HUD, and Safe Image Layer

**Files:**
- Modify: `game/src/app/layout.tsx`
- Modify: `game/src/app/page.tsx`
- Modify: `game/src/app/globals.css`
- Create: `game/src/components/GameApp.tsx`
- Create: `game/src/components/GameApp.test.tsx`
- Create: `game/src/components/TitleScreen.tsx`
- Create: `game/src/components/GameShell.tsx`
- Create: `game/src/components/LifeHud.tsx`
- Create: `game/src/components/SafeImage.tsx`
- Create: corresponding `*.module.css` files

**Interfaces:**
- Consumes: `initialGameState`, `gameReducer`, current chapter selectors, and asset maps.
- Produces: accessible title-to-story entry and the persistent responsive game frame.

- [ ] **Step 1: Write failing title, start, HUD, and reset tests**

```tsx
it("starts a fresh life from the title screen", async () => {
  const user = userEvent.setup();
  render(<GameApp />);
  expect(screen.getByRole("heading", { name: /余生协议/ })).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "开始这一生" }));
  expect(screen.getByText("婴儿期")).toBeInTheDocument();
  expect(screen.getByText("2076")).toBeInTheDocument();
});

it("can restart from the shell without retaining stats", async () => {
  const user = userEvent.setup();
  render(<GameApp />);
  await user.click(screen.getByRole("button", { name: "开始这一生" }));
  await user.click(screen.getByRole("button", { name: "重新开始" }));
  expect(screen.getByRole("button", { name: "开始这一生" })).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the tests and confirm missing-component failures**

Run: `npm test -- src/components/GameApp.test.tsx`

- [ ] **Step 3: Implement the client boundary and screen routing**

`page.tsx` renders `<GameApp />`; only `GameApp.tsx` uses `"use client"` and `useReducer`. Render `TitleScreen` for `title`; for all game screens render `GameShell` with stage/year/location, archive toggle, and reset. Do not import server actions or fetch data.

`TitleScreen` must show the exact title 《余生协议：一个普通人的100年》, the primary action “开始这一生”, a one-sentence premise, and a compact content note covering AI、数据权、资源分配与生命终点议题.

- [ ] **Step 4: Implement global visual tokens and semantic structure**

Define CSS variables for ivory glass, mist blue, deep teal gray, rust gold, focus ring, spacing, 1–2 second stage transition, and 180–280ms controls. Use one `main`, semantic headings, buttons rather than clickable divs, and visible `:focus-visible` rings.

- [ ] **Step 5: Implement `SafeImage` degradation**

Wrap `next/image` with an `onError` state. On failure, hide the broken image, keep its parent gradient, and expose a visually hidden fallback label. Add a test that fires an error event and proves the scene text remains visible.

- [ ] **Step 6: Verify the checkpoint**

Run `npm test -- src/components/GameApp.test.tsx && npm run lint && npm run build`; expect PASS.

---

### Task 7: Implement Dialogue, Choices, Outcomes, Archive, and One Complete Chapter Loop

**Files:**
- Create: `game/src/components/StoryScene.tsx`
- Create: `game/src/components/DialoguePanel.tsx`
- Create: `game/src/components/DialoguePanel.test.tsx`
- Create: `game/src/components/ChoicePanel.tsx`
- Create: `game/src/components/ChoicePanel.test.tsx`
- Create: `game/src/components/OutcomePanel.tsx`
- Create: `game/src/components/LifeArchive.tsx`
- Create: `game/src/components/StageTransition.tsx`
- Modify: `game/src/components/GameApp.tsx`
- Modify: `game/src/game/reducer.ts`

**Interfaces:**
- Consumes: current `ChapterDefinition`, reducer actions, selected choice, and stats.
- Produces: full infant sequence `story → choice → outcome → archive → next stage`.

- [ ] **Step 1: Write failing typewriter/advance tests**

```tsx
it("first click reveals the full line and second click advances", async () => {
  const user = userEvent.setup();
  const onAdvance = vi.fn();
  render(<DialoguePanel line={{ id: "l1", speaker: "栖", text: "生命体征稳定。欢迎来到海岚市，林一。" }} onAdvance={onAdvance} />);
  await user.click(screen.getByTestId("dialogue-panel"));
  expect(screen.getByText("生命体征稳定。欢迎来到海岚市，林一。")).toBeInTheDocument();
  expect(onAdvance).not.toHaveBeenCalled();
  await user.click(screen.getByTestId("dialogue-panel"));
  expect(onAdvance).toHaveBeenCalledOnce();
});
```

Use fake timers to control typewriter timing. Add a reduced-motion test where the full line appears immediately.

- [ ] **Step 2: Write failing choice locking and keyboard tests**

```tsx
it("submits one choice once and locks all cards", async () => {
  const user = userEvent.setup();
  const onChoose = vi.fn();
  render(<ChoicePanel choices={infantChapter.choices} selectedId={null} onChoose={onChoose} />);
  await user.click(screen.getByRole("button", { name: /给孩子最好的起点/ }));
  await user.click(screen.getByRole("button", { name: /可以帮助，但不能替他决定/ }));
  expect(onChoose).toHaveBeenCalledTimes(1);
});
```

Tab order must reach A, B, C; Enter/Space must activate a focused card.

- [ ] **Step 3: Run tests and confirm failures**

Run: `npm test -- src/components/DialoguePanel.test.tsx src/components/ChoicePanel.test.tsx`

- [ ] **Step 4: Implement dialogue and conditional line selection**

`StoryScene` filters lines using `when` against current flags. `DialoguePanel` types 18–24 Chinese characters per second, reveals immediately on first pointer/Enter/Space input, and advances on the second. When the last opening line advances, dispatch `OPEN_CHOICES`. After a choice, `OutcomePanel` also renders the chapter's applicable closing lines before the summary, so no chapter tail dialogue is skipped.

- [ ] **Step 5: Implement neutral three-card choices and outcomes**

Each card renders `title`, `action`, and `risk`, without exact stat deltas or red/green correctness language. After submission, `OutcomePanel` renders the chosen `immediateOutcome`, textual stat changes such as `自主 −1`, and `delayedEcho`. Buttons are disabled after the first accepted choice.

- [ ] **Step 6: Implement the life archive**

Archive shows the current chapter question, seven-stage progress, visible stat bars labelled 0–5, past choice titles, relationship wording, and key echoes. It never shows `publicInfluence` numerically. From an outcome, “记录这一章” opens the archive; inside the archive, “进入下一阶段” invokes `ADVANCE_STAGE`.

- [ ] **Step 7: Complete and test the infant loop**

Add a GameApp test that starts, advances every infant dialogue, selects each of the three infant options in parameterized runs, observes correct outcome text, opens archive, and advances to childhood with a reset `dialogueIndex`. Run all component and reducer tests; expect PASS.

---

### Task 8: Connect All Seven Stages and the Ending Screen

**Files:**
- Create: `game/src/components/EndingScreen.tsx`
- Modify: `game/src/components/GameApp.tsx`
- Modify: `game/src/game/reducer.ts`
- Modify: `game/src/game/reducer.test.ts`
- Create: `game/e2e/full-life.spec.ts`

**Interfaces:**
- Consumes: seven chapters, `deriveEnding`, `deriveRemarks`, `selectKeyEchoes`.
- Produces: complete playable route from title through one legal ending and six reproducible ending fixtures.

- [ ] **Step 1: Write reducer tests for stage boundaries and ending entry**

Assert `ADVANCE_STAGE` increments stages 0–5 and resets `screen` to `story`, `dialogueIndex` to 0, and `pendingChoiceId` to null. At stage 6, the action must derive and store an `endingId` and move to `ending`. Reject `ADVANCE_STAGE` unless the current stage has a recorded choice and screen is `archive`.

- [ ] **Step 2: Write one failing Playwright complete-life test**

Add stable `data-testid` values: `start-game`, `dialogue-panel`, `choice-{id}`, `continue-outcome`, `open-archive`, `next-stage`, `ending-screen`, and `restart-game`.

```ts
test("plays a bounded symbiosis life from birth to ending", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("start-game").click();
  for (const choiceId of ["infant-b", "childhood-b", "teen-b", "youth-b", "adulthood-a", "midlife-a", "elder-b"]) {
    await advanceToChoices(page);
    await page.getByTestId(`choice-${choiceId}`).click();
    await page.getByTestId("continue-outcome").click();
    await page.getByTestId("open-archive").click();
    await page.getByTestId("next-stage").click();
  }
  await expect(page.getByTestId("ending-screen")).toContainText("有边界的共生");
});
```

Define `advanceToChoices(page)` in the same test file by repeatedly clicking the dialogue panel until a `choice-*` button is visible; cap the loop at 30 and throw a clear error on overflow.

- [ ] **Step 3: Run the unit and browser tests and confirm failures**

Run: `npm test -- src/game/reducer.test.ts && npx playwright test e2e/full-life.spec.ts`

- [ ] **Step 4: Implement stage advancement and ending presentation**

`EndingScreen` displays the ending title, narrative, last line, question, five visible stat sidebars, up to three echoes, policy legacy, and all matching remarks. It does not display scores, stars, victory/failure language, or collection percentage. “重新开始另一生” dispatches `RESET_GAME`.

- [ ] **Step 5: Add six deterministic browser routes**

Use these fixtures and assert the named ending:

| Ending | A/B/C sequence from infant to elder |
|---|---|
| 永续节点 | `A-A-A-A-A-A-A` |
| 数据幽灵 | `C-C-C-C-C-C-A` |
| 规则塑造者 | `B-B-B-B-B-B-B` |
| 有边界的共生 | `B-A-A-A-A-A-B` |
| 人间余温 | `C-C-C-C-B-C-C` |
| 无痕离场 | `A-A-A-A-A-A-C` |

If a sequence does not meet its expected threshold under the authoritative rule table, adjust only the fixture choices, never the rule implementation. Keep the final selection group unchanged.

- [ ] **Step 6: Verify all six endings and restart**

Run: `npx playwright test e2e/full-life.spec.ts`; expect all route tests PASS. Then run `npm test`; expect all unit/component tests PASS.

---

### Task 9: Apply Final Visuals, CSS Motion, Responsive Layout, and Reduced Motion

**Files:**
- Modify: `game/src/app/globals.css`
- Modify: all `game/src/components/*.module.css`
- Modify: `game/src/components/StoryScene.tsx`
- Modify: `game/src/components/StageTransition.tsx`
- Create: `game/e2e/responsive.spec.ts`

**Interfaces:**
- Consumes: final component tree and approved PNG assets.
- Produces: desktop-first immersive composition, mobile-operable layout, and motion-safe equivalent behavior.

- [ ] **Step 1: Write failing responsive and reduced-motion browser checks**

For viewports 1440×900, 1024×768, and 390×844, start the game and reach choices. Assert all three cards are visible or reachable by scrolling, no horizontal document overflow exists, and the archive/reset buttons remain operable. In a reduced-motion context, assert the root has `data-reduced-motion="true"` or computed animation durations are `0s`/near-zero.

- [ ] **Step 2: Run the browser checks and record the expected failures**

Run: `npx playwright test e2e/responsive.spec.ts`

- [ ] **Step 3: Compose backgrounds, characters, and UI layers**

Use background cover with a readable teal/black gradient mask. Place at most two character cutouts at once, with stage-specific assets from the manifest. Use object positioning per scene instead of modifying PNGs. For non-core supporting speakers, show a nameplate or soft silhouette. On the `adulthood-c` outcome, fade the work hall and show a CSS gradient sea with slow light particles; do not request another image.

- [ ] **Step 4: Implement restrained motion**

Add slow background zoom/pan, 2–4px character breathing, scene cross-fade, sequential choice-card entrance, hover border/depth, and a 1–2 second year transition. State feedback appears briefly before archive bars update. Avoid camera shake, mouth animation, or red danger styling.

- [ ] **Step 5: Implement responsive rules**

Desktop dialogue width is 70–82vw and choice cards form three columns. Below 768px, cards become one scrollable column, characters become smaller/lower opacity, top status collapses behind “人生档案”, and dialogue text remains at least 16px. Add `min-height: 100dvh`, safe-area padding, and `overflow-wrap: anywhere` for long copy.

- [ ] **Step 6: Implement motion preference behavior**

Use `@media (prefers-reduced-motion: reduce)` to disable typewriter, parallax, particles, breathing, smooth scroll, and long transitions. Functional screen changes remain immediate. No JavaScript animation library is allowed.

- [ ] **Step 7: Verify visuals in the browser at three sizes**

Run `npx playwright test e2e/responsive.spec.ts`. Start the dev server and visually inspect title, one scene per stage, choice cards, day-sea outcome, archive, and all six ending layouts in Chromium. Capture screenshots only as test artifacts under `game/test-results/`, not as source assets.

---

### Task 10: Verify Reset Semantics, Accessibility, Static Operation, and Final Acceptance

**Files:**
- Create: `game/e2e/reset.spec.ts`
- Modify: tests or implementation files only when a concrete verification failure identifies the responsible behavior
- Create: `game/README.md`

**Interfaces:**
- Consumes: completed application.
- Produces: repeatable acceptance evidence and local run instructions.

- [ ] **Step 1: Write refresh/reset tests**

Play through one choice, call `page.reload()`, and assert the title and “开始这一生” return. In a separate test, use “重新开始”, start again, and assert all five initial stat labels reflect `2,1,1,2,1` and no prior choice appears in the archive. Inspect browser storage and assert no game keys exist in localStorage, sessionStorage, or cookies.

- [ ] **Step 2: Add keyboard and image-failure checks**

Navigate title, dialogue, three choices, archive, reset, and ending using Tab/Enter/Space only. Verify focus is visible. Abort one PNG request through Playwright routing and assert the fallback gradient and dialogue remain readable.

- [ ] **Step 3: Document exact local operation**

`README.md` contains only current behavior and commands:

```md
# 余生协议：Next.js 演示原型

运行：`npm install && npm run dev`

检查：`npm run check && npm run test:e2e`

本项目为纯前端单次会话演示：无后端、无账号、无存档、无音频；刷新页面会重新开始。
剧本来源位于上级目录 `剧本/`，原始美术位于上级目录 `素材/`。
```

- [ ] **Step 4: Run the full automated verification**

Run from `game/`:

```bash
npm run lint
npm test
npm run build
npm run test:e2e
```

Expected: every command exits 0; all 21 choice cases and six endings are covered; no network service, account, key, API route, or persisted session is required.

- [ ] **Step 5: Run static-scope audits**

Run:

```bash
test -z "$(find src/app -type d -name api -print)"
if rg -n "localStorage|sessionStorage|document\.cookie|fetch\(|axios|Howler|Audio\(|<audio|<video|framer-motion" src package.json; then exit 1; fi
if rg -n "女孩小满|她.*小满|小满.*恋人|小满.*伴侣" src; then exit 1; fi
```

Expected: the API directory search returns nothing; scope audit returns no forbidden implementation usage; 小满 identity audit returns nothing. Test files may mention storage only to assert its absence.

- [ ] **Step 6: Perform the final manual acceptance route**

Complete one unfamiliar mixed route without test helpers. Confirm: every stage has readable opening/dialogue/three choices/outcome/archive; prior choices create visible later echoes; the final ending is legal; all eight scenes and age-appropriate core characters load; restart clears the life; resizing never makes a required control unreachable.

---

## Final Acceptance Matrix

| Requirement | Evidence |
|---|---|
| Seven playable stages | content contract + full-life Playwright routes |
| 21 choices with exact effects | table-driven `rules.test.ts` |
| Six reachable endings | unit ending table + six browser fixtures |
| State only in memory | refresh/storage browser tests + source audit |
| No backend/login/audio/video | directory/dependency/source audits |
| All approved images used safely | asset manifest + load/failure browser tests |
| Responsive and keyboard operable | three viewport suite + keyboard-only route |
| Reduced motion | emulated media browser test |
| 小满 is a male platonic friend | content tests + text audit |
| No visual “correct answer” | component review and manual acceptance |
