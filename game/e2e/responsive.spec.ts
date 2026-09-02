import { expect, type Locator, type Page, test } from "@playwright/test";

const MAX_ADVANCES = 36;

async function advanceUntil(
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

async function startAndReachChoices(page: Page): Promise<void> {
  await page.goto("/");
  await page.getByTestId("start-game").click();
  await advanceUntil(
    page,
    () => page.locator('[data-testid^="choice-"]').first(),
    "to choices",
  );
}

async function chooseAndReachArchive(page: Page, choiceId: string): Promise<void> {
  await page.getByTestId(`choice-${choiceId}`).click();
  await advanceUntil(
    page,
    () => page.getByTestId("continue-outcome"),
    `through ${choiceId} outcome`,
  );
  await page.getByTestId("open-archive").click();
}

async function assertNoHorizontalOverflow(page: Page): Promise<void> {
  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth,
  }));
  expect(dimensions.document).toBeLessThanOrEqual(dimensions.viewport + 1);
}

for (const viewport of [
  { width: 1440, height: 900 },
  { width: 1024, height: 768 },
  { width: 390, height: 844 },
] as const) {
  test(`${viewport.width}x${viewport.height} keeps choices, archive, and reset operable`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await startAndReachChoices(page);

    const cards = page.locator('[data-testid^="choice-"]');
    await expect(cards).toHaveCount(3);
    for (const card of await cards.all()) {
      await card.scrollIntoViewIfNeeded();
      await expect(card).toBeVisible();
    }
    await assertNoHorizontalOverflow(page);

    await page.getByRole("button", { name: "人生档案" }).click();
    await expect(page.getByRole("button", { name: "返回当前章节" })).toBeVisible();
    await page.getByRole("button", { name: "返回当前章节" }).click();
    await expect(cards.first()).toBeVisible();

    await page.getByRole("button", { name: "重新开始" }).click();
    await expect(page.getByTestId("start-game")).toBeVisible();
    await assertNoHorizontalOverflow(page);
  });
}

test("1920 desktop story and choice frames stay within 70–82vw", async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto("/");
  await page.getByTestId("start-game").click();

  const frame = page.getByTestId("story-frame");
  const dialogue = page.getByTestId("dialogue-panel");
  const storyWidths = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    frame: document.querySelector<HTMLElement>('[data-testid="story-frame"]')
      ?.getBoundingClientRect().width ?? 0,
    dialogue: document.querySelector<HTMLElement>('[data-testid="dialogue-panel"]')
      ?.getBoundingClientRect().width ?? 0,
  }));
  await expect(frame).toBeVisible();
  await expect(dialogue).toBeVisible();
  expect(storyWidths.frame / storyWidths.viewport).toBeGreaterThanOrEqual(0.7);
  expect(storyWidths.frame / storyWidths.viewport).toBeLessThanOrEqual(0.82);
  expect(storyWidths.dialogue / storyWidths.viewport).toBeGreaterThanOrEqual(0.7);
  expect(storyWidths.dialogue / storyWidths.viewport).toBeLessThanOrEqual(0.82);

  await advanceUntil(
    page,
    () => page.locator('[data-testid^="choice-"]').first(),
    "to 1920 choices",
  );
  const choiceWidths = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    frame: document.querySelector<HTMLElement>('[data-testid="story-frame"]')
      ?.getBoundingClientRect().width ?? 0,
    grid: document.querySelector<HTMLElement>('[data-testid^="choice-"]')
      ?.parentElement?.getBoundingClientRect().width ?? 0,
  }));
  expect(choiceWidths.frame / choiceWidths.viewport).toBeGreaterThanOrEqual(0.7);
  expect(choiceWidths.frame / choiceWidths.viewport).toBeLessThanOrEqual(0.82);
  expect(choiceWidths.grid / choiceWidths.viewport).toBeGreaterThanOrEqual(0.7);
  expect(choiceWidths.grid / choiceWidths.viewport).toBeLessThanOrEqual(0.82);
  await assertNoHorizontalOverflow(page);
});

test("archive header is a real toggle and restores focus to its trigger", async ({ page }) => {
  await startAndReachChoices(page);
  const trigger = page.getByRole("button", { name: "人生档案" });

  await trigger.focus();
  await trigger.click();
  await expect(page.getByRole("button", { name: "返回当前章节" })).toBeVisible();

  await trigger.click();
  await expect(page.locator('[data-testid^="choice-"]').first()).toBeVisible();
  await expect(trigger).toBeFocused();

  await trigger.click();
  await page.getByRole("button", { name: "返回当前章节" }).click();
  await expect(page.locator('[data-testid^="choice-"]').first()).toBeVisible();
  await expect(trigger).toBeFocused();
});

test("scene artwork uses cover positioning with no more than two stage cutouts", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("start-game").click();

  const scene = page.getByTestId("scene-layer");
  await expect(scene).toHaveAttribute("data-scene", "birth");
  await expect(scene.locator("img")).toBeVisible();
  await expect(scene.locator("img")).toHaveCSS("object-fit", "cover");

  const cutouts = page.getByTestId("scene-character");
  const count = await cutouts.count();
  expect(count).toBeGreaterThan(0);
  expect(count).toBeLessThanOrEqual(2);
  for (const cutout of await cutouts.all()) {
    await expect(cutout).toBeVisible();
  }
});

test("reduced motion reveals dialogue immediately and removes long motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByTestId("start-game").click();

  const dialogue = page.getByTestId("dialogue-panel");
  await expect(dialogue).toHaveAccessibleDescription("继续对白");
  const motion = await page.evaluate(() => {
    const stage = document.querySelector<HTMLElement>('[role="status"]');
    const frame = document.querySelector<HTMLElement>('[data-testid="story-frame"]');
    const duration = (element: HTMLElement | null, property: "animationDuration" | "transitionDuration") =>
      element ? getComputedStyle(element)[property] : "missing";
    return {
      matches: matchMedia("(prefers-reduced-motion: reduce)").matches,
      stageAnimation: duration(stage, "animationDuration"),
      frameAnimation: duration(frame, "animationDuration"),
      frameTransition: duration(frame, "transitionDuration"),
    };
  });
  expect(motion.matches).toBe(true);
  for (const duration of [motion.stageAnimation, motion.frameAnimation, motion.frameTransition]) {
    expect(duration).not.toBe("missing");
    const milliseconds = duration
      .split(",")
      .map((value) => (value.trim().endsWith("ms") ? Number.parseFloat(value) : Number.parseFloat(value) * 1000));
    expect(Math.max(...milliseconds)).toBeLessThanOrEqual(10);
  }
});

test("adulthood C replaces the work hall with a CSS-only day sea", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByTestId("start-game").click();

  for (const choiceId of [
    "infant-b",
    "childhood-b",
    "teen-b",
    "youth-b",
  ]) {
    await advanceUntil(
      page,
      () => page.getByTestId(`choice-${choiceId}`),
      `to ${choiceId}`,
    );
    await chooseAndReachArchive(page, choiceId);
    await page.getByTestId("next-stage").click();
  }

  await advanceUntil(
    page,
    () => page.getByTestId("choice-adulthood-c"),
    "to adulthood-c",
  );
  await page.getByTestId("choice-adulthood-c").click();

  const scene = page.getByTestId("scene-layer");
  await expect(scene).toHaveAttribute("data-scene", "day-sea");
  await expect(scene).toHaveAttribute("data-scene-mode", "css");
  await expect(scene.locator("img")).toHaveCount(0);
  await expect(page.getByTestId("day-sea-lights")).toBeVisible();
});
