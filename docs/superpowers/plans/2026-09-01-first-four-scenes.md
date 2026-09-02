# 《余生协议》第一批四张场景 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 生成四张风格统一、可同时用于 Next.js 游戏背景和动态 PPT 播片的近未来横屏场景图。

**Architecture:** 每张主背景作为独立资产生成和验收，均不包含固定主角、文字或最终 UI。生成图先保存在内置工具目录，再复制到项目的 `生成源` 和正式场景目录；所有最终提示词统一记录在一个 Markdown 文件中。

**Tech Stack:** 内置图像生成工具、PNG、macOS `sips`、本地视觉检查工具。

**Spec:** `docs/superpowers/specs/2026-09-01-first-four-scenes-design.md`

## Global Constraints

- 画幅为 16:9，四张图的最终像素尺寸必须一致。
- 风格为高级手绘二维概念艺术，带轻微水彩与水粉质感。
- 世界观是干净、可信、有人情味的中国近未来，不使用霓虹赛博朋克或末日废墟风格。
- 画面不得包含可读文字、标志、水印、固定主角或抢占交互安全区的环境人物。
- 下方约 30% 保持低对比度；至少预留一处清晰的人物立绘安全区。
- 每张图都必须具有前景、中景、背景三层景深。
- 正式资产保存到 `素材/场景设定/第一批/`，生成源保存到 `素材/场景设定/第一批/生成源/`。
- 当前目录不是 Git 仓库，执行期间不创建提交；通过文件版本号保留历史版本。

## File Structure

- Create: `素材/场景设定/第一批/01-出生协议室-v1.png` — 出生协议选择背景。
- Create: `素材/场景设定/第一批/02-青屿学习中心-v1.png` — 幼年课堂背景。
- Create: `素材/场景设定/第一批/03-旧公园-v1.png` — 友情线现实锚点背景。
- Create: `素材/场景设定/第一批/04-风险评估室-v1.png` — 少年算法风险事件背景。
- Create: `素材/场景设定/第一批/生成源/` — 保存工具返回的原始 PNG。
- Create: `素材/场景设定/第一批/第一批场景-生成提示词.md` — 记录四张最终提示词、生成方式和修订记录。

---

### Task 1: 出生协议室

**Files:**
- Create: `素材/场景设定/第一批/生成源/01-出生协议室-生成源-v1.png`
- Create: `素材/场景设定/第一批/01-出生协议室-v1.png`

**Interfaces:**
- Consumes: `素材/角色设定/角色总设定图-v2.png`，仅作为画风与色彩参考。
- Produces: 无人物的出生协议室横屏主背景。

- [ ] **Step 1: 用内置图像生成工具生成主背景**

使用以下完整提示词，并将角色总设定图 v2 作为风格参考：

```text
Use case: illustration-story
Asset type: 16:9 environment background for a branching web game and animated PowerPoint cutscene
Primary request: A compassionate Chinese near-future birth protocol room in the year 2076, designed for a serious life-story game. The room should feel safe, beautiful, efficient, and subtly institutional rather than frightening.
Scene: on the left, a translucent neonatal care cradle with soft woven blankets but no visible baby; in the center, a suspended circular diagnostic light and three blank translucent option-card shapes with absolutely no text; on the right, a clean open area where a mother character sprite can later be composited. A broad observation window reveals a calm coastal Chinese city at dawn.
Style: match the reference character bible’s premium cinematic hand-painted 2D concept art, elegant editorial science-fiction illustration, subtle watercolor and gouache texture, clean believable materials.
Composition: wide cinematic establishing shot at human eye level; clear foreground, midground, and background layers; lower 30 percent quiet and low contrast for dialogue UI; strong empty character-safe area on the right; no fixed protagonist.
Palette: warm ivory, pale cyan-blue, soft gray, tiny warm gold accents; gentle dawn light.
Animation-friendly details: separable diagnostic ring, window light, option-card shapes, and subtle monitor glow.
Constraints: no readable text, no logos, no watermark, no doctors, no robots, no baby, no people, no needles, no surgical horror, no cyberpunk neon, no cast UI text, no cropped main object.
```

- [ ] **Step 2: 保存原始文件与正式文件**

将工具返回的实际 PNG 路径复制为：

```text
素材/场景设定/第一批/生成源/01-出生协议室-生成源-v1.png
素材/场景设定/第一批/01-出生协议室-v1.png
```

- [ ] **Step 3: 视觉验收**

打开正式文件，确认右侧人物安全区、下方交互安全区、无人物、无伪文字、三层景深和温柔但制度化的气质。若失败，只针对一个最明显问题生成 v2，不改动其他已满足条件。

### Task 2: 青屿学习中心

**Files:**
- Create: `素材/场景设定/第一批/生成源/02-青屿学习中心-生成源-v1.png`
- Create: `素材/场景设定/第一批/02-青屿学习中心-v1.png`

**Interfaces:**
- Consumes: Task 1 确立的画风、材质密度和横屏构图。
- Produces: 无固定学生的 AI 学习空间背景。

- [ ] **Step 1: 用内置图像生成工具生成主背景**

```text
Use case: illustration-story
Asset type: 16:9 environment background for a branching web game and animated PowerPoint cutscene
Primary request: Qingyu Learning Center in a believable Chinese coastal city in 2084, where AI-personalized education is ordinary. The room is advanced, calm, and humane, but the real open window is the emotional focal point.
Scene: modular pale desks and several blank translucent learning-space panels floating only in the upper half, with no readable text; a large real window is open toward city treetops and distant delivery-drone routes. The room has no blackboard. Leave a clear area for two child character sprites near the center-right.
Style: the same premium cinematic hand-painted 2D concept art as the reference, subtle watercolor and gouache texture, elegant editorial near-future realism.
Composition: wide eye-level interior; distinct foreground desk edge, midground learning area, and background view; lower 30 percent calm and low contrast for dialogue UI; clear center-right character-safe area.
Palette: warm ivory, muted gray-blue, low-saturation teal, warmer natural daylight from the window.
Animation-friendly details: separable floating panels, window curtain, tree canopy, and distant drone lights.
Constraints: no people, no fixed protagonist, no readable writing, no numbers, no logos, no watermark, no traditional blackboard, no school slogan, no neon cyberpunk, no exaggerated children’s-cartoon styling.
```

- [ ] **Step 2: 保存原始文件与正式文件**

将工具返回的实际 PNG 路径复制到两个指定的 Task 2 文件路径。

- [ ] **Step 3: 视觉验收**

确认窗户是情感焦点、教室并非传统黑板课堂、中央偏右可放置林一和小满、下方可覆盖对话框且不存在伪文字。

### Task 3: 旧公园

**Files:**
- Create: `素材/场景设定/第一批/生成源/03-旧公园-生成源-v1.png`
- Create: `素材/场景设定/第一批/03-旧公园-v1.png`

**Interfaces:**
- Consumes: Task 1–2 的手绘风格；小满的铁锈色作为环境点缀但不出现人物。
- Produces: 可在多个年龄阶段复用的旧公园背景。

- [ ] **Step 1: 用内置图像生成工具生成主背景**

```text
Use case: illustration-story
Asset type: 16:9 recurring environment background for a branching web game and animated PowerPoint cutscene
Primary request: An old neighborhood park surviving inside a beautiful automated Chinese coastal city in 2084. It is cared for and repaired, not abandoned. The park represents physical memory, friendship, and knowledge gained by direct observation.
Scene: an aged walking path enters from the foreground and curves beneath mature trees; a repaired old bench and a small blank environmental sensor sit on the right; a few bird feathers and subtle delivery-drone route lights suggest the missing-bird mystery; restrained near-future buildings appear beyond the canopy. Leave the left side open for two walking child sprites.
Style: premium cinematic hand-painted 2D concept art matching the character bible, natural watercolor and gouache texture, serious editorial science-fiction illustration.
Composition: wide eye-level view with foreground path and leaves, midground bench and trees, background city; left character-safe area; lower 30 percent low contrast for dialogue UI.
Palette: natural green, warm brown, weathered rust accents, small cool-blue infrastructure lights; warm late-afternoon light.
Animation-friendly details: layered leaves, a loose feather, drone light trail, distant bird silhouette.
Constraints: no people, no readable text, no logos, no watermark, no ruins, no post-apocalyptic decay, no wilderness, no dense crowd, no visible oversized drone, no fantasy forest.
```

- [ ] **Step 2: 保存原始文件与正式文件**

将工具返回的实际 PNG 路径复制到两个指定的 Task 3 文件路径。

- [ ] **Step 3: 视觉验收**

确认公园是“被维护的旧空间”而非废墟，左侧可放人物，鸟羽、长椅、航线灯清晰但不抢戏，景深适合视差动画。

### Task 4: 风险评估室

**Files:**
- Create: `素材/场景设定/第一批/生成源/04-风险评估室-生成源-v1.png`
- Create: `素材/场景设定/第一批/04-风险评估室-v1.png`

**Interfaces:**
- Consumes: Task 1–3 的共同材质语言与视觉密度。
- Produces: 可通过后期灯光和隔断变化表现风险升级的评估室背景。

- [ ] **Step 1: 用内置图像生成工具生成主背景**

```text
Use case: illustration-story
Asset type: 16:9 environment background for a branching web game and animated PowerPoint cutscene
Primary request: A school algorithmic risk assessment room in a believable Chinese near-future city in 2092. Make invisible predictive pressure visible through spatial separation, without depicting violence or an evil AI.
Scene: a floor-to-ceiling smart-glass partition stands slightly left of center, currently transparent and able to become opaque later; behind it is an empty area reserved for a teenage boy sprite. On the right is an empty area reserved for the protagonist. Include a doorway scanner with a small abstract status light, blank gray profile-panel shapes with no text, cool observation lights, and a narrow exit glow.
Style: premium cinematic hand-painted 2D concept art matching the reference character bible, subtle watercolor and gouache texture, restrained editorial science-fiction realism.
Composition: wide eye-level two-sided composition with direct sightline between left and right character-safe areas; clear foreground floor edge, midground partition, background exit; lower 30 percent quiet for dialogue UI.
Palette: cool gray, deep desaturated teal-blue, soft white; one restrained warning-red status light only.
Animation-friendly details: smart-glass opacity change, scanner light changing green to red, profile shapes fading to gray, ambient light dimming.
Constraints: no people, no fixed protagonist, no readable text, no numbers, no logos, no watermark, no prison bars, no weapons, no police, no violence, no evil AI face, no cyberpunk neon.
```

- [ ] **Step 2: 保存原始文件与正式文件**

将工具返回的实际 PNG 路径复制到两个指定的 Task 4 文件路径。

- [ ] **Step 3: 视觉验收**

确认左右两个人物安全区能够对视，透明隔断位于两者之间，警告红只占极小面积，空间有压迫感但不像监狱或暴力审讯室。

### Task 5: 统一记录与最终验收

**Files:**
- Create: `素材/场景设定/第一批/第一批场景-生成提示词.md`
- Verify: `素材/场景设定/第一批/01-出生协议室-v1.png`
- Verify: `素材/场景设定/第一批/02-青屿学习中心-v1.png`
- Verify: `素材/场景设定/第一批/03-旧公园-v1.png`
- Verify: `素材/场景设定/第一批/04-风险评估室-v1.png`

**Interfaces:**
- Consumes: Tasks 1–4 的四张通过视觉验收的最终图片和实际使用提示词。
- Produces: 可交付的第一批场景包及可复现生成记录。

- [ ] **Step 1: 记录生成信息**

在提示词 Markdown 中逐张写入：用途、最终完整提示词、参考图路径、内置生成模式、采用版本及一次性修订原因（如发生修订）。

- [ ] **Step 2: 检查文件与尺寸**

运行：

```bash
sips -g pixelWidth -g pixelHeight -g format '素材/场景设定/第一批/'0[1-4]-*-v1.png
```

期望：四个文件均为 PNG，像素宽高完全一致，文件非空。

- [ ] **Step 3: 四图并排视觉检查**

确认四图属于同一视觉世界，每张都有交互安全区、人物安全区和三层景深，并且没有人物、伪文字、水印或品牌标志。

- [ ] **Step 4: 报告交付路径**

最终回复中展示四张图片，并链接正式场景目录、生成提示词记录和已批准的设计规格。
