// @vitest-environment jsdom
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { MemoryRouter } from "react-router-dom";
import SiteAnnouncement from "./SiteAnnouncement";
vi.mock("framer-motion", () => ({ useReducedMotion: () => false }));
beforeEach(() => {
  sessionStorage.clear();
  vi.useFakeTimers();
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});
const mount = () =>
  render(
    <MemoryRouter>
      <SiteAnnouncement />
    </MemoryRouter>,
  );
it("rotates announcements and pauses while hovered or focused", () => {
  mount();
  expect(screen.getByRole("link", { name: "浏览全部模型" })).toHaveAttribute(
    "href",
    "/models",
  );
  act(() => vi.advanceTimersByTime(3500));
  expect(screen.getByRole("link", { name: "查看接入指南" })).toHaveAttribute(
    "href",
    "/docs/quick-access",
  );
  const banner = screen.getByRole("complementary", { name: "站点公告" });
  fireEvent.mouseEnter(banner);
  act(() => vi.advanceTimersByTime(7000));
  expect(
    screen.getByRole("link", { name: "查看接入指南" }),
  ).toBeInTheDocument();
  fireEvent.mouseLeave(banner);
  fireEvent.focus(screen.getByRole("link"));
  act(() => vi.advanceTimersByTime(7000));
  expect(
    screen.getByRole("link", { name: "查看接入指南" }),
  ).toBeInTheDocument();
});
it("switches with dots and remembers dismissal within the session", () => {
  const view = mount();
  fireEvent.click(
    screen.getByRole("button", { name: "第 2 条公告：查看接入指南" }),
  );
  expect(
    screen.getByRole("button", { name: "第 2 条公告：查看接入指南" }),
  ).toHaveAttribute("aria-pressed", "true");
  fireEvent.click(screen.getByRole("button", { name: "关闭公告" }));
  expect(screen.queryByRole("complementary")).not.toBeInTheDocument();
  view.unmount();
  mount();
  expect(screen.queryByRole("complementary")).not.toBeInTheDocument();
});
