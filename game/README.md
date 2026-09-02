# 余生协议：Next.js 演示原型

这是一个七阶段互动叙事游戏。玩家将陪伴林一经历婴儿、幼年、少年、青年、壮年、中年和老年，并通过每阶段一次 A/B/C 选择走向不同结局。

## 环境要求

- Node.js `>= 20.9.0`
- pnpm `11.19.0`（推荐使用项目声明的版本）

先检查本机环境：

```bash
node --version
pnpm --version
```

如果尚未安装 pnpm，可任选一种方式：

```bash
# Node.js 自带 Corepack 时
corepack enable
corepack prepare pnpm@11.19.0 --activate

# 如果 Corepack 不可用
npm install --global pnpm@11.19.0
```

## 下载项目依赖

进入包含本项目 `package.json` 的 `game` 目录，并按照锁文件安装依赖：

```bash
cd game
pnpm install --frozen-lockfile
```

如果还需要运行浏览器端到端测试，请额外下载 Playwright 使用的 Chromium：

```bash
pnpm exec playwright install chromium
```

仅游玩游戏时不需要执行 Playwright 安装命令。

## 启动游戏

```bash
cd game
pnpm run dev --hostname 127.0.0.1
```

浏览器打开：<http://127.0.0.1:3000>

终止服务时，在运行服务的终端按 `Ctrl+C`。

## 检查项目

```bash
# ESLint、单元/组件测试和静态构建
pnpm run check

# 完整浏览器端到端测试
pnpm run test:e2e

# TypeScript 类型检查
pnpm exec tsc --noEmit --incremental false
```

也可以分别运行：

```bash
pnpm run lint
pnpm test
pnpm run build
```

## 运行静态导出版本

构建完成后，静态网站位于 `out/`。可以用 Python 自带的静态服务器预览：

```bash
pnpm run build
python3 -m http.server 4173 --directory out
```

然后打开 <http://127.0.0.1:4173>。停止服务同样按 `Ctrl+C`。

## 项目说明

- 纯前端单次会话，无后端、数据库、账号或登录。
- 不使用本地存档；刷新页面会回到标题页。
- 无需 API 密钥或外部网络服务即可完成游戏。
- 原始剧本位于上级目录 `剧本/`。
- 原始美术位于上级目录 `素材/`。
- 运行时内容清单位于 `src/content/`，网页图片位于 `public/assets/`。
