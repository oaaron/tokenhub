// @vitest-environment jsdom
import { beforeEach, afterEach, expect, it, vi } from "vitest";
import {
  render,
  screen,
  fireEvent,
  cleanup,
  waitFor,
  act,
} from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import {
  MemoryRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import userEvent from "@testing-library/user-event";
import ModelsPage from "./ModelsPage";
import PricingPage from "./PricingPage";
import DocsPage from "./DocsPage";
import HomePage from "./HomePage";
import { CodeExample } from "../../components/site/CodeExample";
import { models } from "../../content/models.js";
import { docs } from "../../content/docs.js";

function Location() {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <>
      <button onClick={() => navigate(-1)}>返回上一地址</button>
      <output data-testid="location">
        {location.pathname}
        {location.search}
      </output>
    </>
  );
}
function page(Component, path = "/") {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route
          path="*"
          element={
            <>
              <Component />
              <Location />
            </>
          }
        />
      </Routes>
    </MemoryRouter>,
  );
}
let intersect;
beforeEach(() => {
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(callback) {
        intersect = callback;
      }
      observe() {}
      disconnect() {}
    },
  );
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
it("progressively loads the entire model catalog without pagination and resets search", () => {
  page(ModelsPage, "/models");
  expect(
    screen.queryByRole("navigation", { name: "模型分页" }),
  ).not.toBeInTheDocument();
  while (screen.queryByRole("button", { name: "加载更多模型" }))
    fireEvent.click(screen.getByRole("button", { name: "加载更多模型" }));
  expect(
    screen.getByRole("heading", { name: models.at(-1).displayName }),
  ).toBeInTheDocument();
  fireEvent.change(screen.getByRole("textbox", { name: "搜索模型" }), {
    target: { value: "no-model-found-abc" },
  });
  expect(
    screen.getByRole("heading", { name: "没有找到匹配的模型" }),
  ).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "重置筛选" }));
  expect(
    screen.getByRole("heading", { name: models[0].displayName }),
  ).toBeInTheDocument();
});
it("updates selection and purchase target for every monthly plan without pretending to purchase", () => {
  page(PricingPage, "/pricing");
  fireEvent.click(screen.getAllByRole("button", { name: "选择方案" })[0]);
  expect(screen.getByTestId("location")).toHaveTextContent("plan=Go");
  expect(screen.getByRole("link", { name: "查看开通状态" })).toHaveAttribute(
    "href",
    "/service-status?service=purchase&plan=Go",
  );
  expect(screen.getAllByText("价格待发布")).toHaveLength(4);
  fireEvent.click(screen.getByRole("tab", { name: "用量与接入" }));
  expect(screen.getByText("如何配置 API Key？")).toBeInTheDocument();
});
it("copies the currently selected language and gives feedback", async () => {
  const writeText = vi.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText },
  });
  render(
    <CodeExample
      examples={[
        { language: "Python", code: "print(1)" },
        { language: "cURL", code: "curl example.local" },
      ]}
    />,
  );
  fireEvent.click(screen.getByRole("tab", { name: "cURL" }));
  fireEvent.click(screen.getByRole("button", { name: "复制当前 cURL 代码" }));
  await waitFor(() =>
    expect(writeText).toHaveBeenCalledWith("curl example.local"),
  );
  expect(screen.getByRole("status")).toHaveTextContent("已复制");
});
it("renders deep documentation from an independent route with matching TOC and pagination", () => {
  render(
    <MemoryRouter initialEntries={["/docs/platform-api/query-api-usage"]}>
      <Routes>
        <Route path="/docs/*" element={<DocsPage />} />
      </Routes>
    </MemoryRouter>,
  );
  expect(
    screen.getByRole("heading", { level: 1, name: "查询模型用量" }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("navigation", { name: "章节导航" }),
  ).toBeInTheDocument();
  expect(
    screen.getAllByRole("link", { name: /Ling-3.2-flash/ }).length,
  ).toBeGreaterThan(0);
});
it("has no model-experience or online-trial destination in public home links", () => {
  page(HomePage);
  const links = screen
    .getAllByRole("link")
    .map((link) => link.getAttribute("href"));
  expect(
    links.every((link) => !/(chat|experience|playground)/.test(link)),
  ).toBe(true);
  expect(docs.at(-1).slug).toBe("about/caict-evaluation");
});

it("filters model names and clears stale page state", async () => {
  page(ModelsPage, "/models?page=3");
  fireEvent.change(screen.getByRole("textbox", { name: "搜索模型" }), {
    target: { value: models[0].name },
  });
  await waitFor(() =>
    expect(screen.getByTestId("location")).not.toHaveTextContent("page="),
  );
  expect(
    screen.getByRole("heading", { name: models[0].displayName }),
  ).toBeInTheDocument();
  expect(screen.queryByText("公开目录快照")).not.toBeInTheDocument();
});
it("switches the grid carousel without changing model results", () => {
  page(ModelsPage);
  const before = screen.getAllByRole("heading", { level: 2 }).length;
  fireEvent.click(screen.getByRole("button", { name: "下一个精选模型" }));
  expect(
    screen.getByRole("heading", { name: "多模态，让灵感成形。" }),
  ).toBeInTheDocument();
  expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(before);
});

it("loads the next batch as the bottom sentinel enters the viewport", () => {
  page(ModelsPage);
  const before = screen.getAllByRole("heading", { level: 2 }).length;
  act(() => intersect([{ isIntersecting: true }]));
  expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(
    before + 24,
  );
  fireEvent.change(screen.getByRole("textbox", { name: "搜索模型" }), {
    target: { value: "google" },
  });
  expect(
    screen.getAllByRole("heading", { level: 2 }).length,
  ).toBeLessThanOrEqual(24);
});

it("keeps rapid input complete and browser Back restores the previous query", async () => {
  const user = userEvent.setup();
  page(ModelsPage, "/models");
  const input = screen.getByRole("textbox", { name: "搜索模型" });
  await user.type(input, "openai/gpt-6.2-astra");
  expect(input).toHaveValue("openai/gpt-6.2-astra");
  await waitFor(() =>
    expect(screen.getByTestId("location")).toHaveTextContent("q=openai"),
  );
  fireEvent.click(screen.getByRole("button", { name: "返回上一地址" }));
  expect(input).toHaveValue("");
  await waitFor(() =>
    expect(screen.getByTestId("location").textContent).toBe("/models"),
  );
});
