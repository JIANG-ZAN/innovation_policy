# 余生协议：一个普通人的 100 年

《余生协议》是一款关于 AI、数据权、公共资源分配与生命终点的中文互动叙事游戏。玩家将陪伴林一从 2076 年出生走到 2174 年，在婴儿、幼年、少年、青年、壮年、中年和老年七个阶段分别做出一次 A/B/C 选择，并由这些选择共同导向六种结局之一。

本仓库同时保存了原始剧本、美术素材、产品设计文档和可直接运行的 Next.js 游戏。真正的 Web 工程位于 [`game/`](game/)。

## 项目特点

- 七个人生阶段、21 个主要选择、6 种结局。
- 五项可见状态：自主、辨识、联结、保障、意义。
- 选择会影响人物关系、“栖”的交互倾向、政策环境和多年后的剧情回响。
- 纯前端单次会话，无后端、数据库、账号、API 密钥或外部服务。
- 不保存进度；刷新页面或点击“重新开始”会开启新的人生。
- 支持桌面、平板和手机，并适配 `prefers-reduced-motion`。
- 可以构建为静态网站，便于本地演示或部署到静态托管平台。

## 快速开始

### 1. 准备环境

需要：

- Node.js `>= 20.9.0`
- pnpm `11.19.0`

检查版本：

```bash
node --version
pnpm --version
```

如果尚未安装 pnpm，可以使用 Node.js 自带的 Corepack：

```bash
corepack enable
corepack prepare pnpm@11.19.0 --activate
```

如果 Corepack 不可用：

```bash
npm install --global pnpm@11.19.0
```

### 2. 安装依赖

所有前端命令都要在 `game/` 目录中执行：

```bash
cd game
pnpm install --frozen-lockfile
```

### 3. 启动游戏

```bash
pnpm run dev --hostname 127.0.0.1
```

浏览器打开 <http://127.0.0.1:3000>。停止服务时，在终端按 `Ctrl+C`。

## 怎么玩

1. 在标题页点击“开始这一生”。
2. 点击对话框推进剧情；打字动画播放时第一次点击会立即显示整句，再次点击才会进入下一句。
3. 每个人生阶段从三张选择卡中选择一项。选择一旦提交，本轮人生中不能撤销。
4. 查看即时后果、状态变化和未来回响，然后进入“人生档案”。
5. 在档案中查看阶段进度、五项状态、人物关系、已作选择和关键回声。
6. 完成老年期后进入结局页；可以点击“重新开始另一生”体验其他路线。

游戏不设置“正确答案”、得分或最佳结局。每条路线都会同时呈现技术带来的收益、代价和政策问题。

## 项目目录

### 仓库根目录

| 路径 | 作用 | 日常使用建议 |
| --- | --- | --- |
| `game/` | 可运行的 Next.js 游戏工程 | 启动、开发、测试和构建都从这里进入 |
| `剧本/` | 原始中文剧本与分支规则，共 10 个 Markdown 文件 | 修改故事设定时先更新这里；它是内容与规则的创作源 |
| `素材/` | 场景图、角色设定图、透明立绘、生成源和提示词 | 保存高质量源素材，不由网页直接读取 |
| `docs/superpowers/specs/` | 已确认的产品和视觉设计规格 | 理解产品边界、流程和验收标准 |
| `docs/superpowers/plans/` | 历史实施计划 | 追溯项目如何拆分和实现 |
| `docs/superpowers/handoffs/` | 开发交接记录 | 恢复历史上下文时使用，不参与运行 |
| `.superpowers/` | 开发过程中的任务台账、报告、审查包和快照 | 属于研发记录，正常改剧情或 UI 时无需操作 |
| `tmp/` | 图片拆分等一次性辅助脚本 | 仅用于素材处理，不参与游戏运行 |
| `图片50年后普通人的一生(1).docx` | 项目的早期参考文档 | 用于溯源，不参与构建 |

注意：`剧本/` 和 `素材/` 不会自动同步到网页。游戏运行时实际读取的是 `game/src/content/` 和 `game/public/assets/`。修改源文件后，需要手动更新对应的运行时内容。

### `game/` 工程目录

| 路径 | 作用 |
| --- | --- |
| `src/app/` | Next.js App Router 入口、页面元信息和全局样式 |
| `src/components/` | 标题页、场景、对话、选择、档案、结局等 React 组件及 CSS Modules |
| `src/content/` | 游戏实际加载的章节、21 个选择、6 个结局和素材清单 |
| `src/game/` | 类型模型、初始状态、状态机、规则计算和结局选择器 |
| `src/test/` | Vitest 与 Testing Library 的统一测试环境 |
| `public/assets/` | 网页运行时读取的场景图和透明角色立绘 |
| `e2e/` | Playwright 浏览器测试：完整通关、重置和响应式行为 |
| `next.config.ts` | Next.js 配置；当前使用纯静态导出 |
| `vitest.config.ts` | 单元测试和组件测试配置 |
| `playwright.config.ts` | 浏览器测试配置，会自动启动本地开发服务器 |
| `package.json` | 依赖版本和项目命令 |
| `pnpm-lock.yaml` | 锁定依赖版本，保证不同机器安装结果一致 |

## 运行时模块说明

### 1. 页面入口：`game/src/app/`

- `page.tsx`：首页入口，只负责挂载 `GameApp`。
- `layout.tsx`：根布局和页面元信息。
- `globals.css`：全局重置、颜色、间距和动画变量。
- `page.module.css`：页面级样式。

### 2. 界面组件：`game/src/components/`

| 模块 | 职责 |
| --- | --- |
| `GameApp.tsx` | 游戏总控制器；连接 `useReducer`、章节内容和不同界面 |
| `TitleScreen.tsx` | 标题、项目议题说明和“开始这一生”按钮 |
| `GameShell.tsx` | 游戏外壳；负责背景、章节信息、人生档案入口和重新开始 |
| `LifeHud.tsx` | 常驻显示五项人生状态 |
| `StoryScene.tsx` | 显示当前阶段人物和对话，并按标记或“栖”的倾向筛选条件对白 |
| `DialoguePanel.tsx` | 打字效果、立即显示整句和推进对白 |
| `ChoicePanel.tsx` | 展示三个选择及其行动、风险，并提交唯一有效选择 |
| `OutcomePanel.tsx` | 展示选择后的条件尾声、即时结果、状态增减和延迟回响 |
| `LifeArchive.tsx` | 展示七阶段进度、状态、关系、历史选择和关键回声 |
| `StageTransition.tsx` | 显示阶段切换提示与转场状态 |
| `EndingScreen.tsx` | 展示结局叙述、人生评语、关键回响和政策遗产 |
| `SafeImage.tsx` | 图片加载失败时安全降级，避免场景崩溃或文字不可读 |

组件样式主要放在同名 `*.module.css` 中；多个叙事组件共享 `NarrativePanels.module.css`。

### 3. 内容数据：`game/src/content/`

- `chapters/infant.ts` 至 `chapters/elder.ts`：七个人生阶段的年份、年龄、地点、开场对白、条件尾声和场景映射。
- `choices.ts`：21 个 canonical 选择，包含状态变化、写入标记、即时后果和延迟回响。
- `endings.ts`：六种结局的标题、叙述、最后一句和结局问题。
- `assets.ts`：场景与角色图片路径，以及图片缺失时使用的渐变背景。
- `index.ts`：按人生顺序注册并导出七章内容。
- `content.test.ts`：检查章节、选择数量、ID、默认分支和条件内容的完整性。

内容层只描述“发生什么”，不负责直接判断结局或渲染页面。

### 4. 游戏规则：`game/src/game/`

- `model.ts`：集中定义阶段、选择、状态、关系、政策、结局和 reducer action 等 TypeScript 类型。
- `initial-state.ts`：创建一轮新人生的统一初始状态。
- `reducer.ts`：管理标题 → 剧情 → 选择 → 后果 → 档案 → 下一阶段 → 结局的状态流转。
- `rules.ts`：应用选择、限制状态值到 0—5、处理条件标记，并推导小满关系、“栖”的倾向和政策环境。
- `selectors.ts`：根据最终状态选择结局、附加人生评语和最多三个关键回响。

这部分是纯 TypeScript 规则层，不依赖 React 或浏览器 API，因此可以独立进行单元测试。

### 5. 美术资源：`game/public/assets/`

- `scenes/`：8 张主要场景图。
- `characters/linyi/`：林一从婴儿到老年的 7 个年龄版本。
- `characters/zhoulan/`：周岚的 3 个年龄版本。
- `characters/xiaoman/male/`：小满的 5 个年龄版本。
- `characters/qi/`：“栖”的静默、协助和警告 3 种状态。

网页路径以 `/assets/...` 开头。源素材仍保留在仓库根目录的 `素材/` 中，便于重新裁切、抠图或生成新版本。

## 游戏的数据流

```text
章节与选择数据
      ↓
GameApp 根据当前 screen 选择界面
      ↓
玩家推进对白或提交选择
      ↓
gameReducer 更新内存状态
      ↓
rules / selectors 推导关系、政策、回响与结局
      ↓
组件重新渲染场景、状态、档案或结局
```

当前状态只保存在浏览器内存中，不写入 `localStorage`、Cookie 或服务器。刷新页面会从标题页重新开始，这是项目设计的一部分。

## 常见修改应该改哪里

| 需求 | 主要修改位置 | 还需要检查 |
| --- | --- | --- |
| 修改原始对白或章节设定 | `剧本/*.md` | 同步更新 `game/src/content/chapters/*.ts` |
| 修改选择文案、收益或代价 | `剧本/09-分支变量与回响.md`、`game/src/content/choices.ts` | 更新 `content.test.ts`、`rules.test.ts` 和相关路线测试 |
| 修改条件对白 | `game/src/content/chapters/*.ts` 的 `when` 条件 | 确认存在无条件 fallback，避免无对白可显示 |
| 修改状态、关系或政策规则 | `game/src/game/rules.ts` | 更新 `rules.test.ts` 和 `reducer.test.ts` |
| 修改结局触发条件 | `game/src/game/selectors.ts` | 更新 `selectors.test.ts` 和 `e2e/full-life.spec.ts` |
| 修改结局叙述 | `剧本/08-结局.md`、`game/src/content/endings.ts` | 检查 `EndingScreen` 显示效果 |
| 替换场景或角色图片 | `素材/`、`game/public/assets/` | 如果文件名改变，同时更新 `game/src/content/assets.ts` |
| 修改页面结构或交互 | `game/src/components/*.tsx` | 更新同目录组件测试和 Playwright 测试 |
| 修改颜色、布局或动画 | `game/src/app/globals.css`、`game/src/components/*.module.css` | 检查桌面、平板、手机和 reduced motion |

如果新增人生阶段，不只是增加一个章节文件：还需要同步扩展 `StageId`、章节注册表、reducer 的阶段顺序、素材映射、档案进度和对应测试。

## 测试与质量检查

先进入 `game/`：

```bash
cd game
```

常用命令：

```bash
# ESLint、单元/组件测试和静态构建
pnpm run check

# 仅运行单元测试和组件测试
pnpm test

# 修改代码时持续监听测试
pnpm run test:watch

# TypeScript 类型检查
pnpm exec tsc --noEmit --incremental false
```

浏览器端到端测试首次运行前需要安装 Chromium：

```bash
pnpm exec playwright install chromium
pnpm run test:e2e
```

Playwright 会根据 `playwright.config.ts` 自动启动开发服务器。端到端测试覆盖六种结局路线、重新开始、不同屏幕宽度、人生档案、素材加载和 reduced motion。

## 构建静态版本

```bash
cd game
pnpm run build
```

构建结果位于 `game/out/`。可以用 Python 自带的静态服务器预览：

```bash
python3 -m http.server 4173 --directory out
```

然后打开 <http://127.0.0.1:4173>。

由于项目使用静态导出，部署时只需发布 `out/` 目录，不需要 Node.js 服务器、数据库或运行时环境变量。

## 开发约定与边界

- 原始剧本、原始美术和已确认设计文档应当保留，不要直接用运行时压缩版本覆盖源文件。
- 七个阶段目前固定为每章一个 A/B/C 主选择，共 21 个选择；新增可持久化的次级选择需要同时修改状态模型和规格。
- 小满是林一的男性终身朋友，现有叙事不自动将友情改写为恋爱关系。
- “栖”不是反派；越界行为来自授权、效率目标或制度默认。
- 不要在 React 组件里硬编码具体结局判断，规则应放在 `src/game/`。
- 不要在规则层直接操作 DOM、React 状态或浏览器存储。
- `node_modules/`、`.next/`、`out/`、`test-results/` 和 `playwright-report/` 都是安装、构建或测试产物，不应手工编辑。

更完整的产品边界和设计依据见 [`docs/superpowers/specs/2026-09-02-nextjs-game-prototype-design.md`](docs/superpowers/specs/2026-09-02-nextjs-game-prototype-design.md)。仅需运行游戏时，也可以查看更短的 [`game/README.md`](game/README.md)。
