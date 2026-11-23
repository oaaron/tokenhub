import { expect, it } from "vitest";
import { configureCode, docs } from "./docs.js";
it("generates language-aware environment expressions and preserves alternate endpoint paths", () => {
  expect(
    configureCode('url = "__API_BASE_URL__/v1/models"', "python", {
      apiBaseUrl: null,
      apiRootUrl: null,
    }),
  ).toContain('os.environ["VELINK_API_ROOT_URL"]');
  expect(
    configureCode("curl '__API_BASE_URL__/v1/models'", "bash", {
      apiBaseUrl: null,
      apiRootUrl: null,
    }),
  ).toContain('"${VELINK_API_ROOT_URL}/v1/models"');
  expect(
    configureCode("curl '__API_BASE_URL__/compatible-mode/v1/models'", "bash", {
      apiBaseUrl: "https://test.local/v1",
      apiRootUrl: "https://test.local",
    }),
  ).toContain("https://test.local/compatible-mode/v1/models");
});
it("covers every retained article with unique sections and no experience routes", () => {
  expect(docs).toHaveLength(34);
  expect(docs.some((a) => a.slug.includes("model-experience"))).toBe(false);
  expect(
    docs.every(
      (a) => new Set(a.sections.map((s) => s.id)).size === a.sections.length,
    ),
  ).toBe(true);
});

it("keeps migration commentary and unverified marketing out of visible documentation", () => {
  const visible = docs.map((article) => ({
    title: article.title,
    sections: article.sections,
    links: article.links,
  }));
  expect(JSON.stringify(visible)).not.toMatch(
    /资料说明|原站|原平台|参考平台|公开技术资料整理|99\.5%|节省 20%|30 多个模型/,
  );
  expect(
    docs.every(
      (article) =>
        !article.links?.some((link) =>
          /maas\.antdigital\.com|computrix\.ai/.test(link.to),
        ),
    ),
  ).toBe(true);
});
