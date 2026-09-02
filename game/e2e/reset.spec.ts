import { expect, type Locator, type Page, test } from "@playwright/test";

const MAX_ADVANCES = 36;

async function advanceDialogueUntil(
  page: Page,
  target: () => Locator,
  context: string,
): Promise<void> {
  for (let index = 0; index < MAX_ADVANCES; index += 1) {
    if (await target().isVisible().catch(() => false)) return;

    const dialogue = page.getByTestId("dialogue-panel");
    if (!(await dialogue.isVisible().catch(() => false))) {
      throw new Error(`No dialogue was visible while advancing ${context}.`);
    }
    await dialogue.click();
  }

  throw new Error(`Exceeded ${MAX_ADVANCES} dialogue advances for ${context}.`);
}

async function reachInfantChoices(page: Page): Promise<void> {
  await page.goto("/");
  await page.getByTestId("start-game").click();
  await advanceDialogueUntil(
    page,
    () => page.getByTestId("choice-infant-b"),
    "to the infant choices",
  );
}

async function reachInfantOutcome(page: Page): Promise<void> {
  await reachInfantChoices(page);
  await page.getByTestId("choice-infant-b").click();
  await advanceDialogueUntil(
    page,
    () => page.getByTestId("continue-outcome"),
    "through the infant closing dialogue",
  );
}

async function hasFocus(locator: Locator): Promise<boolean> {
  return locator.evaluate((element) => element === document.activeElement);
}

async function tabTo(
  page: Page,
  target: Locator,
  direction: "forward" | "backward" = "forward",
): Promise<void> {
  for (let index = 0; index < 24; index += 1) {
    if (await hasFocus(target).catch(() => false)) return;
    await page.keyboard.press(direction === "forward" ? "Tab" : "Shift+Tab");
  }

  throw new Error("Keyboard focus did not reach the requested control.");
}

async function expectVisibleKeyboardFocus(locator: Locator): Promise<void> {
  const focus = await locator.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      active: element === document.activeElement,
      focusVisible: element.matches(":focus-visible"),
      outlineStyle: style.outlineStyle,
      outlineWidth: style.outlineWidth,
      boxShadow: style.boxShadow,
    };
  });

  expect(focus.active).toBe(true);
  expect(focus.focusVisible).toBe(true);
  expect(
    (focus.outlineStyle !== "none" && focus.outlineWidth !== "0px") ||
      focus.boxShadow !== "none",
  ).toBe(true);
}

async function advanceKeyboardDialogueUntil(
  page: Page,
  target: () => Locator,
  context: string,
): Promise<void> {
  for (let index = 0; index < MAX_ADVANCES; index += 1) {
    if (await target().isVisible().catch(() => false)) return;

    const dialogue = page.getByTestId("dialogue-panel");
    if (!(await dialogue.isVisible().catch(() => false))) {
      throw new Error(`No dialogue was visible while keyboard-advancing ${context}.`);
    }
    await tabTo(page, dialogue);

    if (await page.getByText("显示完整对白", { exact: true }).isVisible().catch(() => false)) {
      await page.keyboard.press("Space");
      await expect(page.getByText("继续对白", { exact: true })).toBeVisible();
    }
    await page.keyboard.press("Enter");
  }

  throw new Error(`Exceeded ${MAX_ADVANCES} keyboard dialogue advances for ${context}.`);
}

test("refresh returns a progressed life to the exact title with no browser persistence", async ({
  page,
}) => {
  await reachInfantOutcome(page);
  await expect(page.getByRole("heading", { name: "可以帮助，但不能替他决定。" })).toBeVisible();

  await page.reload();

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "《余生协议：一个普通人的100年》",
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "开始这一生", exact: true }),
  ).toBeVisible();

  const storage = await page.evaluate(() => ({
    localStorage: Object.keys(window.localStorage),
    sessionStorage: Object.keys(window.sessionStorage),
    cookie: document.cookie,
  }));
  expect(storage).toEqual({ localStorage: [], sessionStorage: [], cookie: "" });
  expect(await page.context().cookies()).toEqual([]);
});

test("重新开始 creates a fresh life with exact initial stats and an empty archive", async ({
  page,
}) => {
  await reachInfantOutcome(page);
  await page.getByTestId("open-archive").click();
  await expect(page.getByText("可以帮助，但不能替他决定。", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "重新开始", exact: true }).click();
  await page.getByRole("button", { name: "开始这一生", exact: true }).click();

  for (const label of [
    "自主 2，满值 5",
    "辨识 1，满值 5",
    "联结 1，满值 5",
    "保障 2，满值 5",
    "意义 1，满值 5",
  ]) {
    await expect(page.getByLabel(label, { exact: true })).toHaveCount(1);
  }

  await page.getByRole("button", { name: "人生档案", exact: true }).click();
  await expect(page.getByText("尚未记录选择", { exact: true })).toBeVisible();
  await expect(page.getByText("可以帮助，但不能替他决定。", { exact: true })).toHaveCount(0);
});

test("archive preview is a real keyboard toggle and restores trigger focus", async ({ page }) => {
  await page.goto("/");
  const start = page.getByTestId("start-game");
  await tabTo(page, start);
  await page.keyboard.press("Enter");

  const trigger = page.getByRole("button", { name: "人生档案", exact: true });
  await tabTo(page, trigger);
  await page.keyboard.press("Enter");
  await expect(trigger).toHaveAttribute("aria-pressed", "true");

  await page.keyboard.press("Enter");
  await expect(trigger).toHaveAttribute("aria-pressed", "false");
  await expect(trigger).toBeFocused();

  await page.keyboard.press("Enter");
  const close = page.getByRole("button", { name: "返回当前章节", exact: true });
  await tabTo(page, close);
  await page.keyboard.press("Space");
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute("aria-pressed", "false");
});

test("keyboard-only mixed life covers every stage, all choice keys, archive, ending, and restart", async ({
  page,
}) => {
  const route = [
    { id: "infant-a", chapter: "婴儿期——出生协议", title: "给孩子最好的起点。" },
    { id: "childhood-b", chapter: "幼年期——消失的鸟", title: "把答案拆开，我要知道你为什么这样判断。" },
    { id: "teen-c", chapter: "少年期——被预测的人", title: "我先救眼前的人，制度以后再说。" },
    { id: "youth-a", chapter: "青年期——94.7%的人生", title: "如果它真的更了解我，为什么不听？" },
    { id: "adulthood-b", chapter: "壮年期——最后一个工作日", title: "我继续工作，因为有些责任不能外包。" },
    { id: "midlife-c", chapter: "中年期——谁为正确负责", title: "规则拒绝救她，我就不再服从规则。" },
    { id: "elder-a", chapter: "老年期——余生协议", title: "既然还能继续，为什么必须结束？" },
  ] as const;

  await page.goto("/");
  const start = page.getByTestId("start-game");
  await tabTo(page, start);
  await expectVisibleKeyboardFocus(start);
  await page.keyboard.press("Enter");

  const firstDialogue = page.getByTestId("dialogue-panel");
  await tabTo(page, firstDialogue);
  await expectVisibleKeyboardFocus(firstDialogue);
  await expect(page.getByText("显示完整对白", { exact: true })).toBeVisible();
  await page.keyboard.press("Space");
  await expect(page.getByText("继续对白", { exact: true })).toBeVisible();
  await page.keyboard.press("Shift+Tab");
  await page.keyboard.press("Tab");
  await expect(firstDialogue).toBeFocused();
  await page.keyboard.press("Enter");

  for (const [index, step] of route.entries()) {
    await expect(
      page.getByRole("heading", { level: 1, name: step.chapter, exact: true }),
    ).toBeVisible();
    await expect(page.getByTestId("stage-transition")).toBeVisible();

    const choice = page.getByTestId(`choice-${step.id}`);
    await advanceKeyboardDialogueUntil(page, () => choice, `to ${step.id}`);
    await expect(page.locator('[data-testid^="choice-"]')).toHaveCount(3);
    await tabTo(page, choice);
    await expectVisibleKeyboardFocus(choice);
    await page.keyboard.press(index % 2 === 0 ? "Space" : "Enter");

    const outcome = page.getByTestId("continue-outcome");
    await advanceKeyboardDialogueUntil(page, () => outcome, `through ${step.id} closing`);
    await expect(outcome).toBeVisible();
    await expect(page.getByRole("heading", { name: step.title, exact: true })).toBeVisible();

    const record = page.getByTestId("open-archive");
    await tabTo(page, record);
    await expectVisibleKeyboardFocus(record);
    await page.keyboard.press(index % 2 === 0 ? "Enter" : "Space");

    await expect(page.getByRole("heading", { name: "已作选择", exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "关键回声", exact: true })).toBeVisible();
    await expect(page.getByText(step.title, { exact: true })).toBeVisible();
    await expect(page.getByRole("list", { name: "7 阶段人生进度" }).getByRole("listitem"))
      .toHaveCount(7);

    const next = page.getByTestId("next-stage");
    await tabTo(page, next);
    await expectVisibleKeyboardFocus(next);
    await page.keyboard.press(index % 2 === 0 ? "Space" : "Enter");
  }

  const ending = page.getByTestId("ending-screen");
  await expect(ending).toBeVisible();
  await expect(
    ending.getByRole("heading", {
      name: /永续节点|数据幽灵|规则塑造者|有边界的共生|人间余温|无痕离场/,
    }),
  ).toBeVisible();

  const restart = page.getByTestId("restart-game");
  await tabTo(page, restart);
  await expectVisibleKeyboardFocus(restart);
  await page.keyboard.press("Space");
  await expect(page.getByTestId("start-game")).toBeVisible();
});

test("a failed real PNG exposes an accessible fallback while the game remains playable", async ({
  page,
}) => {
  await page.route("**/assets/scenes/01-birth.png", (route) => route.abort());
  await page.goto("/");

  const fallback = page.getByRole("img", {
    name: "场景图片未能加载：海岚市新生儿智能监护室",
    exact: true,
  });
  await expect(fallback).toBeAttached();
  const parentBackground = await fallback.evaluate((element) =>
    getComputedStyle(element.parentElement as HTMLElement).backgroundImage,
  );
  expect(parentBackground).toContain("linear-gradient");
  await expect(page.getByRole("heading", { name: "《余生协议：一个普通人的100年》" })).toBeVisible();
  await expect(page.getByTestId("start-game")).toBeVisible();

  await page.getByTestId("start-game").click();
  await expect(page.getByTestId("dialogue-panel")).toBeVisible();
  await expect(page.getByRole("button", { name: "人生档案", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "重新开始", exact: true })).toBeVisible();
  await page.getByTestId("dialogue-panel").click();
  await expect(page.getByText("继续对白", { exact: true })).toBeVisible();
});

test("independent mixed acceptance covers eight artworks plus day-sea, responsive controls, echoes, and a legal ending", async ({
  page,
}) => {
  const route = [
    {
      choice: "可以帮助，但不能替他决定。",
      scene: "birth",
      sceneSrc: "/assets/scenes/01-birth.png",
      characterSrc: "/assets/characters/linyi/00-infant.png",
      viewport: { width: 1440, height: 900 },
    },
    {
      choice: "先看看真实世界，再回来问AI。",
      scene: "learning-center",
      sceneSrc: "/assets/scenes/02-learning.png",
      characterSrc: "/assets/characters/linyi/08-child.png",
      outcomeScene: "old-park",
      outcomeSceneSrc: "/assets/scenes/03-park.png",
      viewport: { width: 1024, height: 768 },
    },
    {
      choice: "系统可能不完美，但风险不能被忽视。",
      scene: "risk-room",
      sceneSrc: "/assets/scenes/04-risk.png",
      characterSrc: "/assets/characters/linyi/16-teen.png",
      viewport: { width: 390, height: 844 },
    },
    {
      choice: "AI可以计算后果，但不能替人承担后果。",
      scene: "life-planning",
      sceneSrc: "/assets/scenes/05-planning.png",
      characterSrc: "/assets/characters/linyi/23-young-adult.png",
      viewport: { width: 1440, height: 900 },
    },
    {
      choice: "如果不必工作，我想体验更多种人生。",
      scene: "work-service",
      sceneSrc: "/assets/scenes/06-services.png",
      characterSrc: "/assets/characters/linyi/38-adult.png",
      outcomeScene: "day-sea",
      viewport: { width: 1024, height: 768 },
    },
    {
      choice: "如果没有人愿意签名，就不能让机器独自拒绝。",
      scene: "medical-room",
      sceneSrc: "/assets/scenes/07-medical.png",
      characterSrc: "/assets/characters/linyi/58-middle-age.png",
      viewport: { width: 390, height: 844 },
    },
    {
      choice: "我的人生不需要永远可调用。",
      scene: "longevity-room",
      sceneSrc: "/assets/scenes/08-longevity.png",
      characterSrc: "/assets/characters/linyi/98-elder.png",
      viewport: { width: 1440, height: 900 },
    },
  ] as const;
  const observedScenes = new Set<string>();
  const observedScenePngs = new Set<string>();
  const observedCharacters = new Set<string>();

  await page.goto("/");
  await page.getByRole("button", { name: "开始这一生", exact: true }).click();

  for (const [index, step] of route.entries()) {
    await page.setViewportSize(step.viewport);
    await expect(page.getByRole("button", { name: "人生档案", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "重新开始", exact: true })).toBeVisible();
    await expect(page.getByTestId("dialogue-panel")).toBeVisible();

    const scene = page.getByTestId("scene-layer");
    await expect(scene).toHaveAttribute("data-scene", step.scene);
    observedScenes.add(step.scene);
    const sceneImage = scene.locator("img");
    await expect(sceneImage).toBeVisible();
    await expect.poll(
      () => sceneImage.evaluate((image) => (image as HTMLImageElement).naturalWidth),
    ).toBeGreaterThan(0);
    const scenePathname = await sceneImage.evaluate(
      (image) => new URL((image as HTMLImageElement).currentSrc).pathname,
    );
    expect(scenePathname).toBe(step.sceneSrc);
    observedScenePngs.add(scenePathname);

    const coreCharacter = page.getByTestId("scene-character");
    await expect(coreCharacter).toBeVisible();
    const coreCharacterImage = coreCharacter.locator("img");
    await expect.poll(
      () => coreCharacterImage.evaluate(
        (image) => (image as HTMLImageElement).naturalWidth,
      ),
    ).toBeGreaterThan(0);
    const characterPathname = await coreCharacterImage.evaluate(
      (image) => new URL((image as HTMLImageElement).currentSrc).pathname,
    );
    expect(characterPathname).toBe(step.characterSrc);
    observedCharacters.add(characterPathname);

    const choice = page.getByRole("button", { name: new RegExp(step.choice) });
    await advanceDialogueUntil(page, () => choice, `to mixed-route stage ${index + 1}`);
    await expect(page.locator('[data-testid^="choice-"]')).toHaveCount(3);
    await choice.click();

    if ("outcomeScene" in step) {
      await expect(scene).toHaveAttribute("data-scene", step.outcomeScene);
      observedScenes.add(step.outcomeScene);
      if (step.outcomeScene === "day-sea") {
        await expect(scene).toHaveAttribute("data-scene-mode", "css");
        await expect(scene.locator("img")).toHaveCount(0);
      } else {
        const outcomeImage = scene.locator("img");
        await expect(outcomeImage).toBeVisible();
        await expect.poll(
          () => outcomeImage.evaluate((image) => (image as HTMLImageElement).naturalWidth),
        ).toBeGreaterThan(0);
        const outcomePathname = await outcomeImage.evaluate(
          (image) => new URL((image as HTMLImageElement).currentSrc).pathname,
        );
        expect(outcomePathname).toBe(step.outcomeSceneSrc);
        observedScenePngs.add(outcomePathname);
      }
    }

    const outcome = page.getByTestId("continue-outcome");
    await advanceDialogueUntil(page, () => outcome, `through mixed-route stage ${index + 1}`);
    await expect(outcome).toBeVisible();
    await expect(page.getByRole("heading", { name: step.choice, exact: true })).toBeVisible();
    await page.getByRole("button", { name: "记录这一章", exact: true }).click();

    await expect(page.getByRole("heading", { name: "已作选择", exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "关键回声", exact: true })).toBeVisible();
    await expect(page.getByText("回声尚未形成", { exact: true })).toHaveCount(0);
    await expect(page.getByText(step.choice, { exact: true })).toBeVisible();
    if (index === 1) {
      await expect(page.getByText(
        "少年和中年更容易要求人工复核，老年可自主划定记忆保存范围。",
        { exact: true },
      )).toBeVisible();
    }

    const overflow = await page.evaluate(() => ({
      client: document.documentElement.clientWidth,
      scroll: document.documentElement.scrollWidth,
    }));
    expect(overflow.scroll).toBeLessThanOrEqual(overflow.client + 1);

    await page.getByTestId("next-stage").click();
  }

  expect([...observedScenes].sort()).toEqual([
    "birth",
    "day-sea",
    "learning-center",
    "life-planning",
    "longevity-room",
    "medical-room",
    "old-park",
    "risk-room",
    "work-service",
  ].sort());
  expect([...observedScenePngs].sort()).toEqual([
    "/assets/scenes/01-birth.png",
    "/assets/scenes/02-learning.png",
    "/assets/scenes/03-park.png",
    "/assets/scenes/04-risk.png",
    "/assets/scenes/05-planning.png",
    "/assets/scenes/06-services.png",
    "/assets/scenes/07-medical.png",
    "/assets/scenes/08-longevity.png",
  ].sort());
  expect([...observedCharacters].sort()).toEqual([
    "/assets/characters/linyi/00-infant.png",
    "/assets/characters/linyi/08-child.png",
    "/assets/characters/linyi/16-teen.png",
    "/assets/characters/linyi/23-young-adult.png",
    "/assets/characters/linyi/38-adult.png",
    "/assets/characters/linyi/58-middle-age.png",
    "/assets/characters/linyi/98-elder.png",
  ].sort());
  await expect(page.getByTestId("ending-screen")).toBeVisible();
  await expect(
    page.getByTestId("ending-screen").getByRole("heading", {
      name: /永续节点|数据幽灵|规则塑造者|有边界的共生|人间余温|无痕离场/,
    }),
  ).toBeVisible();

  await page.getByRole("button", { name: "重新开始另一生", exact: true }).click();
  await expect(page.getByRole("button", { name: "开始这一生", exact: true })).toBeVisible();
});
