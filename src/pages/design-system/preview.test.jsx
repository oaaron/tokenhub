// @vitest-environment jsdom
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import DesignSystemPreview from "../DesignSystemPreview";
beforeEach(() => {
  vi.stubGlobal("matchMedia", () => ({
    matches: false,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
  }));
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe() {}
      disconnect() {}
    },
  );
  localStorage.clear();
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
it("renders the complete page, changes theme and persists the preference", () => {
  const { container } = render(<DesignSystemPreview />);
  expect(screen.getByRole("heading", { name: /让复杂/ })).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "切换深色主题" }));
  expect(container.firstChild).toHaveAttribute("data-theme", "dark");
  expect(localStorage.getItem("velink-theme")).toBe("dark");
  expect(
    screen.getByRole("button", { name: "切换浅色主题" }),
  ).toBeInTheDocument();
});
it("filters sample models and provides an empty state with reset", () => {
  render(<DesignSystemPreview />);
  fireEvent.change(screen.getByRole("textbox", { name: "搜索示例模型" }), {
    target: { value: "不存在" },
  });
  expect(screen.getByText("没有匹配的示例模型。")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "清空搜索" }));
  expect(screen.getAllByRole("button", { name: "查看示例" })).toHaveLength(3);
});
it("validates the demo form before creating a local-only named configuration", () => {
  render(<DesignSystemPreview />);
  fireEvent.click(screen.getByRole("button", { name: "创建示例密钥" }));
  fireEvent.click(screen.getByRole("button", { name: "创建", exact: true }));
  expect(screen.getByLabelText("密钥名称")).toHaveAttribute(
    "aria-invalid",
    "true",
  );
  fireEvent.change(screen.getByLabelText("密钥名称"), {
    target: { value: "业务助手" },
  });
  fireEvent.click(screen.getByRole("button", { name: "创建", exact: true }));
  expect(screen.getByText(/示例配置「业务助手」已创建/)).toBeInTheDocument();
  expect(screen.queryByLabelText("密钥名称")).not.toBeInTheDocument();
});
