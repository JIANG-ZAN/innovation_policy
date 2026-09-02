import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createInitialGameState } from "@/game/initial-state";
import type { DialogueLine, QiTendency } from "@/game/model";
import { selectApplicableDialogueLines } from "./StoryScene";
import { DialoguePanel } from "./DialoguePanel";

const line: DialogueLine = {
  id: "l1",
  speaker: "栖",
  text: "生命体征稳定。欢迎来到海岚市，林一。",
};

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("DialoguePanel", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("types at 20 Chinese characters per second", () => {
    render(<DialoguePanel line={line} onAdvance={vi.fn()} />);

    expect(screen.queryByText(line.text)).not.toBeInTheDocument();
    act(() => vi.advanceTimersByTime(500));
    expect(screen.getByTestId("dialogue-text")).toHaveTextContent(
      line.text.slice(0, 10),
    );
    expect(screen.queryByText(line.text)).not.toBeInTheDocument();
  });

  it("first pointer click reveals the full line and second click advances", () => {
    const onAdvance = vi.fn();
    render(<DialoguePanel line={line} onAdvance={onAdvance} />);

    fireEvent.click(screen.getByTestId("dialogue-panel"));
    expect(screen.getByText(line.text)).toBeInTheDocument();
    expect(onAdvance).not.toHaveBeenCalled();

    fireEvent.click(screen.getByTestId("dialogue-panel"));
    expect(onAdvance).toHaveBeenCalledOnce();
  });

  it("exposes the complete speaker and line with the current action to assistive technology", () => {
    render(<DialoguePanel line={line} onAdvance={vi.fn()} />);

    const panel = screen.getByRole("button", {
      name: new RegExp(`栖.*${line.text}`),
    });
    expect(panel).toHaveAccessibleDescription("显示完整对白");

    fireEvent.click(panel);
    expect(panel).toHaveAccessibleName(new RegExp(`栖.*${line.text}`));
    expect(panel).toHaveAccessibleDescription("继续对白");
  });

  it.each(["{Enter}", " "])(
    "uses %s once to reveal and once to advance without duplicate native activation",
    async (key) => {
      vi.useRealTimers();
      const user = userEvent.setup();
      const onAdvance = vi.fn();
      render(<DialoguePanel line={line} onAdvance={onAdvance} />);

      await user.tab();
      expect(screen.getByTestId("dialogue-panel")).toHaveFocus();
      await user.keyboard(key);
      expect(screen.getByText(line.text)).toBeInTheDocument();
      expect(onAdvance).not.toHaveBeenCalled();

      await user.keyboard(key);
      expect(onAdvance).toHaveBeenCalledOnce();
    },
  );

  it("shows the complete line immediately for reduced motion", () => {
    vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    render(<DialoguePanel line={line} onAdvance={vi.fn()} />);

    expect(screen.getByText(line.text)).toBeInTheDocument();
  });
});

describe("selectApplicableDialogueLines", () => {
  const conditionalLines: DialogueLine[] = [
    { id: "always", speaker: "旁白", text: "始终出现" },
    {
      id: "flags",
      speaker: "旁白",
      text: "标记条件成立",
      when: {
        allFlags: ["必需"],
        anyFlags: ["任一甲", "任一乙"],
        noneFlags: ["排除"],
      },
    },
    {
      id: "guardian",
      speaker: "栖",
      text: "守护型回应",
      when: { qiTendency: "guardian" },
    },
    {
      id: "symbiotic-or-tool",
      speaker: "栖",
      text: "共生或工具型回应",
      when: { qiTendency: ["symbiotic", "tool"] },
    },
  ];

  it("combines allFlags, anyFlags, and noneFlags from the full GameState", () => {
    const included = selectApplicableDialogueLines(conditionalLines, {
      ...createInitialGameState(),
      flags: ["必需", "任一乙"],
    });
    const excluded = selectApplicableDialogueLines(conditionalLines, {
      ...createInitialGameState(),
      flags: ["必需", "任一甲", "排除"],
    });

    expect(included.map(({ text }) => text)).toContain("标记条件成立");
    expect(excluded.map(({ text }) => text)).not.toContain("标记条件成立");
  });

  it.each<[QiTendency, string]>([
    ["guardian", "守护型回应"],
    ["symbiotic", "共生或工具型回应"],
    ["tool", "共生或工具型回应"],
  ])("filters the %s Qi tendency without choice-specific logic", (qiTendency, expected) => {
    const visible = selectApplicableDialogueLines(conditionalLines, {
      ...createInitialGameState(),
      qiTendency,
    });

    expect(visible.map(({ text }) => text)).toContain(expected);
  });
});
