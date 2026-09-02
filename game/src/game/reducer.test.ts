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

  it("moves through dialogue, choice, outcome, and archive screens", () => {
    const started = gameReducer(initialGameState, { type: "START_GAME" });
    const secondLine = gameReducer(started, {
      type: "ADVANCE_DIALOGUE",
      lineCount: 3,
    });
    const finalLine = gameReducer(secondLine, {
      type: "ADVANCE_DIALOGUE",
      lineCount: 3,
    });
    const cappedAtFinalLine = gameReducer(finalLine, {
      type: "ADVANCE_DIALOGUE",
      lineCount: 3,
    });
    const choices = gameReducer(cappedAtFinalLine, { type: "OPEN_CHOICES" });
    const outcome = gameReducer(choices, { type: "SHOW_OUTCOME" });
    const archive = gameReducer(outcome, { type: "OPEN_ARCHIVE" });

    expect(secondLine.dialogueIndex).toBe(1);
    expect(finalLine.dialogueIndex).toBe(2);
    expect(cappedAtFinalLine.dialogueIndex).toBe(2);
    expect(choices.screen).toBe("choice");
    expect(outcome.screen).toBe("outcome");
    expect(archive.screen).toBe("archive");
  });

  it("submits the current stage choice once and opens its outcome", () => {
    const choiceScreen = { ...initialGameState, screen: "choice" as const };

    const submitted = gameReducer(choiceScreen, {
      type: "SUBMIT_CHOICE",
      choiceId: "infant-b",
    });

    expect(submitted.screen).toBe("outcome");
    expect(submitted.stats).toEqual({
      autonomy: 3,
      discernment: 2,
      connection: 1,
      security: 3,
      meaning: 1,
    });
    expect(submitted.publicInfluence).toBe(0);
    expect(submitted.flags).toEqual(["监护型芯片", "人类确认权"]);
    expect(submitted.choices).toEqual({ infant: "infant-b" });
    expect(submitted.pendingChoiceId).toBe("infant-b");

    const duplicate = gameReducer(
      { ...submitted, screen: "choice" },
      { type: "SUBMIT_CHOICE", choiceId: "infant-b" },
    );
    expect(duplicate).toEqual({ ...submitted, screen: "choice" });
  });

  it("rejects a choice from a different stage", () => {
    const choiceScreen = { ...initialGameState, screen: "choice" as const };

    expect(
      gameReducer(choiceScreen, { type: "SUBMIT_CHOICE", choiceId: "teen-a" }),
    ).toBe(choiceScreen);
  });

  it("rejects choice submission outside the choice screen", () => {
    expect(
      gameReducer(initialGameState, { type: "SUBMIT_CHOICE", choiceId: "infant-a" }),
    ).toBe(initialGameState);
  });

  it("applies conditional flags before refreshing relationship, Qi, and policy", () => {
    const choiceScreen = {
      ...initialGameState,
      screen: "choice" as const,
      stageIndex: 5,
      stats: { ...initialGameState.stats, discernment: 3 },
      flags: ["小满羁绊", "查证习惯"],
    };

    const submitted = gameReducer(choiceScreen, {
      type: "SUBMIT_CHOICE",
      choiceId: "midlife-b",
    });

    expect(submitted.flags).toContain("复核胜诉");
    expect(submitted.xiaomanRelation).toBe("bond");
    expect(submitted.qiTendency).toBe("symbiotic");
    expect(submitted.policy).toBe("co-governance");
  });

  it("applies the institutional security penalty once at creation", () => {
    const choiceScreen = {
      ...initialGameState,
      screen: "choice" as const,
      stageIndex: 5,
      stats: { ...initialGameState.stats, security: 3 },
    };

    const submitted = gameReducer(choiceScreen, {
      type: "SUBMIT_CHOICE",
      choiceId: "midlife-c",
    });

    expect(submitted.flags).toContain("制度惩罚");
    expect(submitted.stats.security).toBe(0);
    expect(submitted.policy).toBe("social-conflict");
  });

  it("advances an archived completed chapter into childhood story at dialogue zero", () => {
    const archived = {
      ...initialGameState,
      screen: "archive" as const,
      dialogueIndex: 6,
      choices: { infant: "infant-b" as const },
      pendingChoiceId: "infant-b" as const,
    };

    expect(gameReducer(archived, { type: "ADVANCE_STAGE" })).toMatchObject({
      screen: "story",
      stageIndex: 1,
      dialogueIndex: 0,
      pendingChoiceId: null,
    });
  });

  it.each([
    [0, "infant", "infant-b"],
    [1, "childhood", "childhood-b"],
    [2, "teen", "teen-b"],
    [3, "youth", "youth-b"],
    [4, "adulthood", "adulthood-b"],
    [5, "midlife", "midlife-b"],
  ] as const)(
    "advances completed archived stage %i into the next story",
    (stageIndex, stageId, choiceId) => {
      const archived = {
        ...initialGameState,
        screen: "archive" as const,
        stageIndex,
        dialogueIndex: 8,
        choices: { [stageId]: choiceId },
        pendingChoiceId: choiceId,
      };

      expect(gameReducer(archived, { type: "ADVANCE_STAGE" })).toMatchObject({
        screen: "story",
        stageIndex: stageIndex + 1,
        dialogueIndex: 0,
        pendingChoiceId: null,
        endingId: null,
      });
    },
  );

  it("derives and stores the ending after the completed elder archive", () => {
    const archived = {
      ...initialGameState,
      screen: "archive" as const,
      stageIndex: 6,
      publicInfluence: 4,
      flags: ["AI责任倡议"],
      choices: { elder: "elder-b" as const },
      pendingChoiceId: "elder-b" as const,
    };

    expect(gameReducer(archived, { type: "ADVANCE_STAGE" })).toMatchObject({
      screen: "ending",
      stageIndex: 6,
      endingId: "rule-shaper",
    });
  });

  it("does not advance from an incomplete archive", () => {
    const archived = { ...initialGameState, screen: "archive" as const };
    expect(gameReducer(archived, { type: "ADVANCE_STAGE" })).toBe(archived);
  });

  it("does not advance a completed stage outside the archive", () => {
    const outcome = {
      ...initialGameState,
      screen: "outcome" as const,
      choices: { infant: "infant-b" as const },
      pendingChoiceId: "infant-b" as const,
    };

    expect(gameReducer(outcome, { type: "ADVANCE_STAGE" })).toBe(outcome);
  });
});
