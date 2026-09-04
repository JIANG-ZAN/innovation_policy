import { StrictMode } from "react";
import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import BackgroundMusic from "./BackgroundMusic";

describe("BackgroundMusic", () => {
  beforeEach(() => {
    vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(() => {});
    vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
  });

  afterEach(() => vi.restoreAllMocks());

  it("keeps its source after a Strict Mode effect remount", () => {
    const { container } = render(
      <StrictMode>
        <BackgroundMusic />
      </StrictMode>,
    );

    expect(container.querySelector("audio")).toHaveAttribute(
      "src",
      "/audio/final2.mp3",
    );
  });
});
