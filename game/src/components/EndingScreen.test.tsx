import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { boundedSymbiosisEnding } from "@/content/endings";
import { initialGameState } from "@/game/initial-state";
import { deriveRemarks, selectKeyEchoes } from "@/game/selectors";
import type { GameState } from "@/game/model";
import { EndingScreen } from "./EndingScreen";

afterEach(cleanup);

const endingState: GameState = {
  ...initialGameState,
  screen: "ending",
  stageIndex: 6,
  stats: {
    autonomy: 4,
    discernment: 4,
    connection: 3,
    security: 2,
    meaning: 4,
  },
  publicInfluence: 4,
  flags: ["拒绝预测", "查证习惯", "公开申诉", "小满羁绊"],
  choices: {
    infant: "infant-b",
    childhood: "childhood-b",
    teen: "teen-b",
    youth: "youth-c",
    adulthood: "adulthood-b",
    midlife: "midlife-b",
    elder: "elder-b",
  },
  xiaomanRelation: "bond",
  qiTendency: "symbiotic",
  policy: "co-governance",
  pendingChoiceId: "elder-b",
  endingId: "bounded-symbiosis",
};

describe("EndingScreen", () => {
  it("presents the complete ending archive without exposing a score or hidden influence", async () => {
    const user = userEvent.setup();
    const onRestart = vi.fn();
    render(<EndingScreen state={endingState} onRestart={onRestart} />);

    expect(screen.getByTestId("ending-screen")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: boundedSymbiosisEnding.title }),
    ).toBeInTheDocument();
    for (const paragraph of boundedSymbiosisEnding.narrative) {
      expect(screen.getByText(paragraph)).toBeInTheDocument();
    }
    expect(screen.getByText(boundedSymbiosisEnding.lastLine)).toBeInTheDocument();
    expect(screen.getByText(boundedSymbiosisEnding.question)).toBeInTheDocument();

    for (const [label, value] of [
      ["自主", 4],
      ["辨识", 4],
      ["联结", 3],
      ["保障", 2],
      ["意义", 4],
    ] as const) {
      expect(
        screen.getByLabelText(`${label} ${value}，满值 5`),
      ).toBeInTheDocument();
    }

    const echoes = selectKeyEchoes(endingState);
    expect(echoes).toHaveLength(3);
    for (const echo of echoes) {
      expect(screen.getByText(echo)).toBeInTheDocument();
    }
    for (const remark of deriveRemarks(endingState)) {
      expect(screen.getByText(remark)).toBeInTheDocument();
    }
    expect(
      screen.getByText(/高风险决定必须由具体的人类签名/),
    ).toBeInTheDocument();

    expect(screen.queryByText(/公共影响力\s*4/)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/分数|得分|星级|胜利|失败|最佳路线|收集百分比|collection%/i),
    ).not.toBeInTheDocument();

    await user.click(screen.getByTestId("restart-game"));
    expect(onRestart).toHaveBeenCalledOnce();
  });
});
