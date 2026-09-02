import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { GameApp } from "./GameApp";
import { SafeImage } from "./SafeImage";
import { infantChapter } from "@/content";

afterEach(cleanup);

describe("GameApp", () => {
  it("presents the title, premise, and content note", () => {
    render(<GameApp />);

    expect(
      screen.getByRole("heading", {
        name: "《余生协议：一个普通人的100年》",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("从出生协议到生命终点，你替林一走过一个普通人的一百年。"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/AI、数据权、资源分配与生命终点/),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "开始这一生" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("main")).toHaveLength(1);
  });

  it("starts a fresh life from the title screen and shows the HUD", async () => {
    const user = userEvent.setup();
    render(<GameApp />);

    await user.click(screen.getByRole("button", { name: "开始这一生" }));

    expect(screen.getByText("婴儿期")).toBeInTheDocument();
    expect(screen.getByText("2076")).toBeInTheDocument();
    expect(
      screen.getByText("海岚市安澜医院，新生儿智能监护室"),
    ).toBeInTheDocument();
    expect(screen.getByText("自主")).toBeInTheDocument();
    expect(screen.getByText("辨识")).toBeInTheDocument();
    expect(screen.getByText("联结")).toBeInTheDocument();
    expect(screen.getByText("保障")).toBeInTheDocument();
    expect(screen.getByText("意义")).toBeInTheDocument();
  });

  it("keeps the archive entry and reset available from the shell", async () => {
    const user = userEvent.setup();
    render(<GameApp />);

    await user.click(screen.getByRole("button", { name: "开始这一生" }));
    await user.click(screen.getByRole("button", { name: "人生档案" }));

    expect(screen.getByRole("button", { name: "重新开始" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "重新开始" }));
    expect(
      screen.getByRole("button", { name: "开始这一生" }),
    ).toBeInTheDocument();
  });

  it("opens a read-only archive preview and returns to the same revealed dialogue", async () => {
    const user = userEvent.setup();
    render(<GameApp />);
    await user.click(screen.getByRole("button", { name: "开始这一生" }));

    await user.click(screen.getByTestId("dialogue-panel"));
    expect(screen.getByText(infantChapter.opening[0].text)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "人生档案" }));

    expect(screen.getByRole("heading", { name: infantChapter.question })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "进入下一阶段" })).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "返回当前章节" }));

    expect(screen.getByText(infantChapter.opening[0].text)).toBeInTheDocument();
    await user.click(screen.getByTestId("dialogue-panel"));
    await user.click(screen.getByTestId("dialogue-panel"));
    expect(screen.getByText(infantChapter.opening[1].text)).toBeInTheDocument();
  });

  it("previews the archive during closing without skipping dialogue or granting stage advance", async () => {
    const user = userEvent.setup();
    render(<GameApp />);
    await user.click(screen.getByRole("button", { name: "开始这一生" }));
    for (const openingLine of infantChapter.opening) {
      await user.click(screen.getByTestId("dialogue-panel"));
      expect(screen.getByText(openingLine.text)).toBeInTheDocument();
      await user.click(screen.getByTestId("dialogue-panel"));
    }
    const choice = infantChapter.choices[1];
    await user.click(screen.getByRole("button", { name: new RegExp(choice.title) }));
    const closingLines = infantChapter.closing.filter(
      (line) => !line.when || line.when.allFlags?.every((flag) => choice.addFlags.includes(flag)),
    );

    await user.click(screen.getByTestId("dialogue-panel"));
    expect(screen.getByText(closingLines[0].text)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "人生档案" }));
    expect(screen.queryByRole("button", { name: "进入下一阶段" })).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "返回当前章节" }));

    expect(screen.getByText(closingLines[0].text)).toBeInTheDocument();
    await user.click(screen.getByTestId("dialogue-panel"));
    await user.click(screen.getByTestId("dialogue-panel"));
    expect(screen.getByText(closingLines[1].text)).toBeInTheDocument();
    await user.click(screen.getByTestId("dialogue-panel"));
    for (const closingLine of closingLines.slice(2)) {
      await user.click(screen.getByTestId("dialogue-panel"));
      expect(screen.getByText(closingLine.text)).toBeInTheDocument();
      await user.click(screen.getByTestId("dialogue-panel"));
    }

    expect(screen.getByText(choice.immediateOutcome[0])).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "记录这一章" }));
    expect(screen.getByRole("button", { name: "进入下一阶段" })).toBeEnabled();
  });

  it.each(infantChapter.choices)(
    "completes infant story → choice → outcome → archive → childhood for $id",
    async (choice) => {
      const user = userEvent.setup();
      render(<GameApp />);
      await user.click(screen.getByRole("button", { name: "开始这一生" }));

      for (const openingLine of infantChapter.opening) {
        await user.click(screen.getByTestId("dialogue-panel"));
        expect(screen.getByText(openingLine.text)).toBeInTheDocument();
        await user.click(screen.getByTestId("dialogue-panel"));
      }

      await user.click(screen.getByRole("button", { name: new RegExp(choice.title) }));
      const applicableClosing = infantChapter.closing.filter(
        (line) => !line.when || line.when.allFlags?.every((flag) => choice.addFlags.includes(flag)),
      );
      for (const closingLine of applicableClosing) {
        await user.click(screen.getByTestId("dialogue-panel"));
        expect(screen.getByText(closingLine.text)).toBeInTheDocument();
        await user.click(screen.getByTestId("dialogue-panel"));
      }

      expect(screen.getByText(choice.immediateOutcome[0])).toBeInTheDocument();
      expect(screen.getByText(choice.delayedEcho)).toBeInTheDocument();
      await user.click(screen.getByRole("button", { name: "记录这一章" }));

      expect(screen.getByRole("heading", { name: infantChapter.question })).toBeInTheDocument();
      expect(screen.getByText(choice.title)).toBeInTheDocument();
      expect(screen.queryByText(/公共影响力\s*\d/)).not.toBeInTheDocument();
      await user.click(screen.getByRole("button", { name: "进入下一阶段" }));

      expect(screen.getByRole("heading", { name: "幼年期——消失的鸟" })).toBeInTheDocument();
      await user.click(screen.getByTestId("dialogue-panel"));
      expect(screen.getByText("教室没有黑板。方老师关闭每个孩子面前的学习投影，打开一扇真正的窗户。")).toBeInTheDocument();
    },
  );
});

describe("SafeImage", () => {
  it("hides a failed image while keeping scene text readable", () => {
    render(
      <section style={{ background: "linear-gradient(#17394a, #f2ead8)" }}>
        <SafeImage
          src="/assets/scenes/01-birth.png"
          alt="新生儿智能监护室"
          width={1200}
          height={800}
        />
        <h2>第一次选择发生在你还不会说话的时候。</h2>
      </section>,
    );

    const image = screen.getByRole("img", { name: "新生儿智能监护室" });
    fireEvent.error(image);

    expect(image).not.toBeVisible();
    expect(
      screen.getByRole("img", {
        name: "场景图片未能加载：新生儿智能监护室",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "第一次选择发生在你还不会说话的时候。",
      }),
    ).toBeVisible();
  });
});
