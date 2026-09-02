# 《余生协议》Next.js 项目完整 Handoff Prompt

下面内容可直接作为新主 Agent 的首条任务提示。你不是从头设计项目，而是恢复一个已经进入实施中段的、采用子代理驱动开发的任务。

---

你现在接手 `/Users/wangyijin/Documents/创新政策作业` 中的 Next.js 互动叙事游戏《余生协议：一个普通人的100年》。用户已经批准设计规格和实施计划，并明确选择“子代理分任务执行”。不要重新讨论产品方案，不要重写计划，不要重新搭建项目；从现有 SDD 台账恢复并继续完成。

## 1. 首先必须做的事

1. 用中文向用户发送一句简短 commentary，说明你正在恢复子代理驱动开发。
2. 在采取任何其他行动前，完整读取并遵守：
   - `superpowers:using-superpowers`
   - `superpowers:subagent-driven-development`
   - `superpowers:test-driven-development`
   - `superpowers:test-driven-development/writing-good-tests.md`
3. 不要重新调用 brainstorming 或 writing-plans：设计和实施计划已批准。
4. 读取以下三个权威文件：
   - 设计规格：`/Users/wangyijin/Documents/创新政策作业/docs/superpowers/specs/2026-09-02-nextjs-game-prototype-design.md`
   - 实施计划：`/Users/wangyijin/Documents/创新政策作业/docs/superpowers/plans/2026-09-02-nextjs-game-prototype.md`
   - SDD 台账：`/Users/wangyijin/Documents/创新政策作业/.superpowers/sdd/2026-09-02-nextjs-game-prototype/progress.md`
5. 用 `update_plan` 建立/恢复 Task 1–10 的清单。状态必须是：
   - Task 1–4：completed
   - Task 5：in_progress（已实现，但独立审查未通过，等待 fix round 1）
   - Task 6–10：pending
6. 检查当前 `game/`、Task 5 报告和审查包是否存在，不要重新生成或覆盖现有实现。

## 2. 用户目标与不可变产品边界

游戏从林一出生开始，依次经历婴儿、幼年、少年、青年、壮年、中年、老年七阶段，通过每阶段 A/B/C 三个主选择表现 AI 浪潮对普通人一生的影响，最后进入六种主要结局之一。

不可变约束：

- Next.js App Router + React + TypeScript。
- 工程位于 `/Users/wangyijin/Documents/创新政策作业/game/`。
- 完整可玩，而不是静态页面集合。
- 只有 7×3＝21 个 canonical 主选择；不要增加新的持久化次级选择，除非用户另行批准新规格。
- `useReducer` 管理单次会话，状态只在浏览器内存。
- 无后端、数据库、API 路由、登录、注册、账号、云存档。
- 无 `localStorage`、Cookie 或持久化；刷新即回到标题页。
- 无配音、音乐、环境音、音频控制、视频、动态 PPT、Canvas 游戏引擎。
- 动画只用 CSS transition、keyframes 和浏览器原生能力，不安装 React 动画库。
- 五项可见状态：自主、辨识、联结、保障、意义；隐藏状态：公共影响力；统一限制在 0–5。
- 小满始终是男性终身朋友，只写友情，不自动变成恋爱或伴侣。
- “栖”不是反派；越界只来自授权、效率目标或制度默认。
- 原始 `剧本/`、`素材/`、设计文档不得被覆盖或改写。
- 叙事来源：`剧本/01-婴儿期.md` 至 `剧本/08-结局.md`。
- 规则来源：`剧本/09-分支变量与回响.md`。
- 静态导出：`next.config.ts` 使用 `output: "export"` 与 `images.unoptimized: true`。
- 桌面/平板完整，手机可操作；尊重 `prefers-reduced-motion`。

## 3. 当前运行环境与 Git 裁定

默认 shell PATH 没有 Node/npm/npx。使用 Codex 工作区内置运行时：

```bash
export PATH="/Users/wangyijin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/wangyijin/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH"
node --version   # 已验证 v24.19.0
pnpm --version   # 已验证 11.19.0
```

所有命令使用 pnpm：`pnpm test`、`pnpm run lint`、`pnpm run build`、`pnpm exec tsc --noEmit`、`pnpm run test:e2e`。

当前目录在 handoff 时 `git status` 报告“not a git repository”。此前也没有可安全使用的提交历史。不要初始化 Git，不要 commit/add/reset/push/merge，不要创建 worktree。用户已批准采用文件快照和 `git diff --no-index` 进行每任务审查。

源代码编辑必须使用 `apply_patch`；格式化或生成型操作、依赖安装、测试、快照与审查包生成可以使用命令行。不要删除用户资产。

## 4. 子代理驱动开发纪律

用户已明确授权使用 subagents。继续严格执行：

- 同一时间只运行一个实现子代理，避免共享目录冲突。
- 每个任务使用新的实现子代理；Task 5 当前处于修复轮，若旧 `/root/task5_implementer` 在新线程不可访问，则派一个新的高能力实现子代理，给它 brief、report、审查发现和本 handoff 中的裁定。
- 实现子代理不得再派 subagents。
- 每个行为修改严格 TDD：先写测试、运行并确认预期 RED，再写最小实现、运行 GREEN。
- 实现者把完整报告写入 SDD workspace，聊天中只返回简短状态。
- 实现后生成“上一批准快照 → 当前快照”的 review package，再派新的只读 reviewer。
- Reviewer 必须同时给出规格符合性和代码质量结论；不能用实现者自审代替。
- 有真实规格缺口或 Important/Critical finding 时进入最多 5 轮修复；第 1–3 轮优先恢复原实现者，恢复不了才派新的实现者。
- Minor finding 写入 ledger，交给最终整体审查处理，不阻塞任务。
- 不要在主控制 Agent 中自己修 review findings；让实现子代理修，再派 scoped re-reviewer。
- 不要在任务之间询问用户“是否继续”；连续执行到全部完成，除非出现不可逆操作、安全问题、外部发布/推送或计划完全无法裁定。
- 持续用简短中文 commentary 更新用户，进行中的工作不要长时间无状态说明。

模型路由建议：

- 清晰机械任务：`gpt-5.6-terra`，high。
- 复杂内容/集成/审查：`gpt-5.6-sol`，high 或 xhigh。
- 最终整体代码审查：当前可用的最强模型，xhigh。

## 5. SDD 文件与快照约定

SDD workspace：

`/Users/wangyijin/Documents/创新政策作业/.superpowers/sdd/2026-09-02-nextjs-game-prototype/`

已有关键文件：

- `progress.md`
- `task-1-brief.md` … `task-5-brief.md`
- `task-1-report.md` … `task-5-report.md`
- `task-1-review-package.md` … `task-5-review-package.md`
- `task-4-fix1-review-package.md`
- `snapshots/task-1-head/`、`task-2-head/`、`task-3-head/`、`task-4-fix1/`、`task-5-head/`

生成后续 task brief 时，由于技能脚本内部可执行权限/无 Git 环境不稳定，请显式提供输出文件：

```bash
bash "/Users/wangyijin/.codex/plugins/cache/openai-curated-remote/superpowers/6.3.0/skills/subagent-driven-development/scripts/task-brief" \
  "docs/superpowers/plans/2026-09-02-nextjs-game-prototype.md" \
  6 \
  ".superpowers/sdd/2026-09-02-nextjs-game-prototype/task-6-brief.md"
```

为每个批准状态创建快照，排除依赖与构建产物：

```bash
mkdir -p ".superpowers/sdd/2026-09-02-nextjs-game-prototype/snapshots/task-N-head"
rsync -a --delete \
  --exclude node_modules --exclude .next --exclude out \
  --exclude test-results --exclude playwright-report \
  "game/" ".superpowers/sdd/2026-09-02-nextjs-game-prototype/snapshots/task-N-head/"
```

无 Git 仓库也可用 `git diff --no-index` 生成快照差异；返回码 1 表示有差异，不是失败：

```bash
git diff --no-index -- "<approved-base-snapshot>" "<current-snapshot>" || true
```

把差异输出到该任务的 `task-N-review-package.md`，reviewer 只读 brief、report、diff package 和必要权威源文件。

## 6. 已完成工作

### Task 1：工程、测试工具与素材

已完成并审查通过：

- Next.js 16.3.3、React 19.2.8、TypeScript、App Router、src-dir、无 Tailwind。
- pnpm lockfile。
- Vitest/jsdom/Testing Library/Playwright。
- Chromium、Headless Shell、FFmpeg 已安装。
- 静态导出构建成功。
- 8 张场景图、7 张林一、3 张周岚、5 张男性小满、3 张栖，合计 26 张运行时 PNG。
- `sceneAssets`/`characterAssets` 清单。

### Task 2：模型与内存会话

已完成并审查通过：

- `model.ts` 的 Stage/Choice/Stats/Screen/Relation/Qi/Policy/Ending/GameState 类型。
- `createInitialGameState()`、`initialGameState`。
- `gameReducer` 的基础屏幕状态机和 fresh reset。

### Task 3：21 个选择规则

已完成并审查通过：

- `choiceDefinitions` 包含 21 个 canonical choice。
- `clampStat`、`applyChoice`。
- reducer 只接受当前阶段、choice 屏幕中的第一次合法提交。
- 所有状态与公共影响力限制在 0–5。

### Task 4：条件规则、关系、政策、栖和结局

已完成，一轮修复后复审通过：

- 中年复核、非法治疗、社区支援/制度惩罚。
- 小满 `estranged/lost` 终止优先级。
- 四种政策、三种栖倾向。
- 六结局、五类附加评语、最多三个关键回响。
- 修复了决裂/失联仍误入“人间余温”的问题。
- 修复了 `查证习惯`、`决策顾问`在回响相关性排序中被漏掉的问题。

已裁定：`永续节点`当前必须有 `精英延寿资格`；不要直接把 `co-governance` 当作“完整普惠生物延寿”，因为规则源只承诺有限延寿，模型也没有普惠完整延寿状态。

## 7. 当前准确状态：Task 5 已实现但审查未通过

Task 5 实现报告：

`/Users/wangyijin/Documents/创新政策作业/.superpowers/sdd/2026-09-02-nextjs-game-prototype/task-5-report.md`

Task 5 初审差异：

`/Users/wangyijin/Documents/创新政策作业/.superpowers/sdd/2026-09-02-nextjs-game-prototype/task-5-review-package.md`

Task 5 审查基线快照：

`/Users/wangyijin/Documents/创新政策作业/.superpowers/sdd/2026-09-02-nextjs-game-prototype/snapshots/task-5-head/`

目前已有七个章节模块、registry、asset fallbacks、CSS-only day-sea 和 `choiceScenes`。实现者报告 82/82 tests、lint、TypeScript 通过，但独立 reviewer 发现 5 个 Important 语义问题。Task 5 不能标记完成。

### Task 5 fix round 1 必须处理的发现

1. **中年期存在决裂后小满重新出现的可达路径。**
   - `midlife-closing-illegal-supported` 只检查 `非法治疗`+`社区支援`，没有排除 `小满决裂`/`小满失联`。
   - 修复：小满本人对白必须加终止排除；若只有社区支援，改为“社区成员/旧友网络”而不是小满本人。
   - 先加可达路线回归测试：childhood C → teen A → youth C → adulthood B → midlife C 不得出现小满近友对白。

2. **老年 C 的栖关系分支错误且不完整。**
   - 源剧本要求托管型、共生型、工具型三种对白。
   - 现实现用 `答案依赖`≈恐惧、`无植入`≈工具，遗漏共生，并与实际 `deriveQiTendency` 条件不一致。
   - 推荐最小修复：扩展 `DialogueLine.when`，允许用派生的 `qiTendency` 条件（例如 `qiTendency?: QiTendency | QiTendency[]`），然后在 elder 数据中分别编码 guardian/symbiotic/tool 三条；Task 7 的条件行过滤器必须读取完整 GameState 并支持该字段。
   - 必须有三类测试，不能用原始单个 flag 代替派生倾向。

3. **青年/壮年遗漏或错放过去选择的条件回响。**
   - 青年 B 需要：`公开申诉`奖学金、`查证习惯`证据缺口、无相关标记的贷款 fallback。
   - 青年 A 的过去经历回响不能在玩家接受合同前无条件提前展示；应放在 A 的 closing/outcome 条件中。
   - 壮年 A/B 需要补合同/地下互助与三种职业史条件结果。
   - 使用 `when` 条件和 unconditional fallback；不要把逻辑硬编码到 React。

4. **青年与中年尾声的次级选择在当前 schema 中无法持久化。**
   - 已做产品范围裁定：不要新增第二套持久化微选择，也不要把总选择数扩展到 21 之外。
   - 保留源剧本中的多个可能回应作为尾声叙事/问题文本，但不能假装玩家选择了某一项。
   - 后续中年/老年只使用中性回响，不得断言某个未记录的青年回答或数字人格处置已发生。
   - 裁定代价：这两个微选择在 MVP 中不独立可选/持久化；若以后要做，需新规格与新计划。

5. **少年 B 缺少证据条件造成的实质结果。**
   - 有 `查证习惯`：小满风险标签被撤销，并启动训练数据审计。
   - 无 `查证习惯`：评估维持，但进入公开听证/质询。
   - 将结果编码为条件 closing lines，并加具体测试；不要只保留抽象“提出质疑”的对白。

6. **补强内容测试。**
   - 对上述终止排除、三种栖倾向、青年/壮年条件映射、少年 B 成败结果写明确行为测试。
   - 测试必须先失败，再修数据/接口。

### Task 5 fix round 1 执行方式

如果原 `/root/task5_implementer` 不可恢复，派新的实现子代理，要求它先读：

- `task-5-brief.md`
- `task-5-report.md`
- 本 handoff 的 Task 5 findings
- 七个原始章节 Markdown

它必须把 fix 记录追加到 `task-5-report.md`，包含 RED/GREEN、覆盖测试、命令、完整结果和自审。

修复后：

1. 创建 `snapshots/task-5-fix1/`。
2. 从 `snapshots/task-5-head/` 到 `task-5-fix1/` 生成 `task-5-fix1-review-package.md`。
3. 派新的 scoped re-reviewer，只验证 5 个 findings 和 fix diff 新引入的问题。
4. 全部 addressed 后才在 ledger 写：
   - `Task 5: fix round 1/5 (...)`
   - `Task 5: complete (...)`
5. 将 update_plan 的 Task 5 改为 completed，Task 6 改为 in_progress。

## 8. Task 6–10 的后续执行

不要凭本 handoff 自己概括实现；每个任务必须从正式计划提取 task brief，按 brief 逐项实施。

### Task 6

标题页、GameApp、GameShell、LifeHud、SafeImage、基础视觉变量。先做组件 RED/GREEN。标题必须显示《余生协议：一个普通人的100年》、“开始这一生”和议题提示。

### Task 7

StoryScene、DialoguePanel、ChoicePanel、OutcomePanel、LifeArchive、StageTransition，以及婴儿期完整闭环。要支持 Task 5 新增的条件字段（包括 qiTendency 条件），不能在组件里硬编码具体 choice ID。打字效果：第一次点击立即显示整句，第二次推进。

### Task 8

接通七阶段与 EndingScreen，建立六条可重复通关路线和完整 Playwright 测试。结束页显示结局、五状态侧写、最多三个回响、政策遗产和附加评语，不显示胜负、星级或最佳路线。

### Task 9

最终视觉、CSS 动画、响应式、day-sea CSS 场景、降动效。在开始浏览器可视化检查前，完整读取 `browser:control-in-app-browser` 的 SKILL.md。必须用真实本地页面检查桌面、平板、手机和 reduced-motion；不要生成额外图片，除非当前素材确实无法满足且用户另行同意。

### Task 10

刷新/重置/无存储、键盘、图片失败、静态运行、README 和最终验收。执行 scope audit，证明不存在后端、持久化、音视频和错误的小满身份文本。

## 9. 已知非阻塞技术债

这些已写入 ledger，任务中不要反复当作新阻塞：

- Vitest/Vite ESM-in-CommonJS future-default warning。
- `game/.DS_Store` 文件噪声。
- `tsconfig.tsbuildinfo` 编译缓存应在最终清理/忽略。
- Task 2 reset 测试没有显式检查全部 nested reference，生产实现正确。
- Task 3 表测试没有对 raw deltas/完整 flag 数组做最严格断言，生产字面量已审查正确。
- Task 4 没有独立 `社区支援`→人间余温回归测试，生产逻辑保留该路径。

最终整体审查要重新评估这些 minor，决定哪些在交付前必须修复。

## 10. 最终整体审查与交付门槛

所有 Task 1–10 完成后：

1. 完整读取并使用：
   - `superpowers:requesting-code-review`
   - `superpowers:verification-before-completion`
   - `superpowers:finishing-a-development-branch`（当前无 Git，需按环境裁定为“无分支可合并”，不能伪造提交）
2. 从空 `game/` 基线到最终快照生成 whole-project review package。
3. 派最强可用模型做整体审查，向它提供：spec、plan、ledger、whole diff、所有 deferred minors 和全部 Ruling。
4. 若整体审查有 findings，只派一个 fix subagent 处理完整 finding 列表，然后做一次 scoped re-review。
5. 执行 fresh final verification：

```bash
cd "/Users/wangyijin/Documents/创新政策作业/game"
export PATH="/Users/wangyijin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/wangyijin/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH"
pnpm run lint
pnpm test
pnpm run build
pnpm run test:e2e
```

6. 使用浏览器完成至少三条代表路线和所有六结局可达性检查，并检查 1440×900、1024×768、390×844、reduced-motion、刷新重置和图片失败降级。
7. 做静态范围审计，确认：
   - 无 `src/app/api/`
   - 无 local/session storage 或 cookie 持久化
   - 无 fetch/axios 外部依赖
   - 无 audio/video/canvas/动画库
   - 无女性/恋爱化小满文本
8. 最终回答用户时，列出：
   - 可运行的游戏目录链接
   - 启动与检查命令
   - 测试/构建/E2E 的真实数字
   - 所有 ledger `Ruling:` 及“如果裁定错误会有什么代价”
   - 当前没有 Git 分支/commit 的事实

在所有验证成功前，不要声称项目“完成”“可交付”或“全部通过”。

## 11. 当前第一条实际动作

恢复 Task 5 fix round 1，而不是开始 Task 6。先读取 Task 5 brief/report/review findings 和七章源文，生成一个只负责修复 Task 5 的实现子代理；等待其报告后生成 fix-only diff，派 scoped re-reviewer。Task 5 复审通过后，按计划连续执行 Task 6–10。

