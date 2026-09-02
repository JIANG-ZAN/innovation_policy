import { expect, type Page, test } from "@playwright/test";

const MAX_DIALOGUE_ADVANCES = 30;

async function advanceDialogueUntil(
  page: Page,
  target: () => ReturnType<Page["locator"]>,
  context: string,
): Promise<void> {
  for (let advances = 0; advances < MAX_DIALOGUE_ADVANCES; advances += 1) {
    if (await target().isVisible().catch(() => false)) {
      return;
    }

    const dialogue = page.getByTestId("dialogue-panel");
    if (!(await dialogue.isVisible().catch(() => false))) {
      throw new Error(
        `Expected dialogue while advancing ${context}, but none was visible after ${advances} clicks.`,
      );
    }
    await dialogue.click();
  }

  throw new Error(
    `Exceeded ${MAX_DIALOGUE_ADVANCES} dialogue clicks while advancing ${context}.`,
  );
}

async function advanceToChoices(page: Page): Promise<void> {
  await advanceDialogueUntil(
    page,
    () => page.locator('[data-testid^="choice-"]').first(),
    "to the next chapter choices",
  );
}

async function advanceToOutcomeSummary(page: Page, choiceId: string): Promise<void> {
  await advanceDialogueUntil(
    page,
    () => page.getByTestId("continue-outcome"),
    `through every closing line after ${choiceId}`,
  );
}

const lifeRoutes = [
  {
    ending: "永续节点",
    choices: ["infant-a", "childhood-a", "teen-a", "youth-a", "adulthood-a", "midlife-a", "elder-a"],
  },
  {
    ending: "数据幽灵",
    choices: ["infant-c", "childhood-c", "teen-c", "youth-c", "adulthood-c", "midlife-c", "elder-a"],
  },
  {
    ending: "规则塑造者",
    choices: ["infant-b", "childhood-b", "teen-b", "youth-b", "adulthood-b", "midlife-b", "elder-b"],
  },
  {
    ending: "有边界的共生",
    choices: ["infant-b", "childhood-a", "teen-a", "youth-a", "adulthood-a", "midlife-a", "elder-b"],
  },
  {
    ending: "人间余温",
    choices: ["infant-c", "childhood-c", "teen-c", "youth-c", "adulthood-b", "midlife-c", "elder-c"],
  },
  {
    ending: "无痕离场",
    choices: ["infant-a", "childhood-a", "teen-a", "youth-a", "adulthood-a", "midlife-a", "elder-c"],
  },
] as const;

test.describe("complete life routes", () => {
  test.describe.configure({ mode: "serial" });

  for (const route of lifeRoutes) {
    test(`reaches ${route.ending} and starts another life`, async ({ page }) => {
      await page.goto("/");
      await page.getByTestId("start-game").click();

      for (const choiceId of route.choices) {
        await advanceToChoices(page);
        await page.getByTestId(`choice-${choiceId}`).click();
        await advanceToOutcomeSummary(page, choiceId);
        await expect(page.getByTestId("continue-outcome")).toBeVisible();
        await page.getByTestId("open-archive").click();
        await page.getByTestId("next-stage").click();
      }

      await expect(page.getByTestId("ending-screen")).toBeVisible();
      await expect(
        page.getByRole("heading", { name: route.ending, exact: true }),
      ).toBeVisible();

      await page.getByTestId("restart-game").click();
      await expect(page.getByTestId("start-game")).toBeVisible();
    });
  }
});
