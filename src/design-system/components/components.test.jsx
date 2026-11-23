// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  act,
} from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { Button } from "./Button";
import { Input } from "./Input";
import { useMediaQuery } from "../hooks/useMediaQuery";
afterEach(cleanup);
it("blocks duplicate activation while loading and exposes busy state", () => {
  const click = vi.fn();
  const { rerender } = render(
    <Button loading onClick={click}>
      保存
    </Button>,
  );
  fireEvent.click(screen.getByRole("button"));
  expect(click).not.toHaveBeenCalled();
  expect(screen.getByRole("button")).toHaveAttribute("aria-busy", "true");
  rerender(<Button onClick={click}>保存</Button>);
  fireEvent.click(screen.getByRole("button"));
  expect(click).toHaveBeenCalledTimes(1);
});
it("associates labels, hints and validation messages with the input", () => {
  render(<Input label="API 名称" hint="用于识别用途" error="名称不能为空" />);
  const input = screen.getByLabelText("API 名称");
  expect(input).toHaveAttribute("aria-invalid", "true");
  expect(input).toHaveAccessibleDescription("用于识别用途 名称不能为空");
});
it("subscribes to media changes and cleans up on unmount", () => {
  let callback;
  const remove = vi.fn();
  const query = {
    matches: false,
    addEventListener: vi.fn((_, fn) => {
      callback = fn;
    }),
    removeEventListener: remove,
  };
  vi.stubGlobal("matchMedia", () => query);
  function Probe() {
    return (
      <span>{useMediaQuery("(max-width: 768px)") ? "mobile" : "desktop"}</span>
    );
  }
  const { unmount } = render(<Probe />);
  expect(screen.getByText("desktop")).toBeInTheDocument();
  act(() => {
    query.matches = true;
    callback();
  });
  expect(screen.getByText("mobile")).toBeInTheDocument();
  unmount();
  expect(remove).toHaveBeenCalledWith("change", expect.any(Function));
  vi.unstubAllGlobals();
});
