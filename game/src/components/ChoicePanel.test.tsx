import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { infantChapter } from "@/content";
import { ChoicePanel } from "./ChoicePanel";

afterEach(cleanup);

describe("ChoicePanel", () => {
  it("shows three neutral title/action/risk cards without exact deltas", () => {
    render(
      <ChoicePanel
        choices={infantChapter.choices}
        selectedId={null}
        onChoose={vi.fn()}
      />,
    );

    for (const choice of infantChapter.choices) {
      expect(screen.getByText(choice.title)).toBeInTheDocument();
      expect(screen.getByText(choice.action)).toBeInTheDocument();
      expect(screen.getByText(choice.risk)).toBeInTheDocument();
    }
    expect(screen.queryByText(/[自主辨识联结保障意义]\s*[+−-]\s*\d/)).not.toBeInTheDocument();
    expect(screen.queryByText(/正确|错误|最优选项/)).not.toBeInTheDocument();
  });

  it("submits one choice once and synchronously locks all cards", async () => {
    const user = userEvent.setup();
    const onChoose = vi.fn();
    render(
      <ChoicePanel
        choices={infantChapter.choices}
        selectedId={null}
        onChoose={onChoose}
      />,
    );

    await user.click(screen.getByRole("button", { name: /A给孩子最好的起点/ }));
    await user.click(screen.getByRole("button", { name: /B可以帮助，但不能替他决定/ }));

    expect(onChoose).toHaveBeenCalledOnce();
    expect(onChoose).toHaveBeenCalledWith("infant-a");
    for (const card of screen.getAllByRole("button")) {
      expect(card).toBeDisabled();
    }
  });

  it.each(["{Enter}", " "])("tabs A, B, C in order and activates C with %s", async (key) => {
    const user = userEvent.setup();
    const onChoose = vi.fn();
    render(
      <ChoicePanel
        choices={infantChapter.choices}
        selectedId={null}
        onChoose={onChoose}
      />,
    );

    const [a, b, c] = screen.getAllByRole("button");
    await user.tab();
    expect(a).toHaveFocus();
    await user.tab();
    expect(b).toHaveFocus();
    await user.tab();
    expect(c).toHaveFocus();
    await user.keyboard(key);

    expect(onChoose).toHaveBeenCalledOnce();
    expect(onChoose).toHaveBeenCalledWith("infant-c");
  });
});
