import { describe, expect, it } from "vitest";
import {
  models,
  filterModels,
  formatContext,
  getModel,
  modalities,
  referencePrice,
  isReferenceFree,
} from "./models.js";
import { loadModelDetail } from "./modelDetails.js";

describe("verified ZenMux public catalog", () => {
  it("contains all 257 unique model IDs in the source newest order", () => {
    expect(models).toHaveLength(257);
    expect(new Set(models.map((model) => model.slug)).size).toBe(257);
    expect(new Set(models.map((model) => model.name)).size).toBe(257);
    expect(new Set(models.map((model) => model.uniqueId)).size).toBe(257);
    expect(models[0].name).toBe("google/gemini-4-neon");
    expect(models[1].name).toBe("microsoft/microsoft-decision-1.1");
    expect(
      models.every(
        (model) => model.slug.startsWith("zm-") && !model.slug.includes("/"),
      ),
    ).toBe(true);
    expect(
      models.every(
        (model) => model.name.includes("/") && model.sourceCatalog === "ZenMux",
      ),
    ).toBe(true);
    expect(getModel(models.at(-1).slug)).toBe(models.at(-1));
    expect(getModel("openai/gpt-6.2-astra").name).toBe("openai/gpt-6.2-astra");
    expect(filterModels({})).toHaveLength(257);
  });

  it("loads every detail with Chinese editorial summaries and verified provider specifications", async () => {
    let providerCount = 0;
    let priceCount = 0;
    for (const summary of models) {
      const detail = await loadModelDetail(summary.slug);
      expect(detail.uniqueId).toBe(summary.uniqueId);
      expect(detail.name).toBe(summary.name);
      expect(detail.detailVerified).toBe(true);
      expect(detail.zhDescription).toMatch(/[\u4e00-\u9fff]/);
      expect(detail.zhDescription.length).toBeGreaterThan(20);
      expect(detail.zhDescription.length).toBeLessThan(200);
      expect(detail.exampleCodes).toEqual([]);
      expect(detail.serviceConfiguration).toContain("服务配置待开通");
      expect(detail.iconUrl).toMatch(/^https:\/\/cdn\.marmot-cloud\.com\//);
      expect(detail.providerNames).toEqual(
        detail.providerDetails
          .map((provider) => provider.name)
          .filter((name, i, all) => all.indexOf(name) === i),
      );
      for (const provider of detail.providerDetails) {
        expect(provider.apiProtocols).toBeTypeOf("object");
        expect(provider.priceInfo.prices.length).toBeGreaterThan(0);
      }
      for (const stage of detail.priceInfo.prices) {
        expect(stage.priceCurrency).toBe("USD");
        for (const price of stage.price) {
          expect(Number.isFinite(Number(price.priceValue))).toBe(true);
          expect(price.unitCode).toBeTruthy();
          expect(price.constraints).toBeInstanceOf(Array);
        }
      }
      // Every original fee record and its constraints survives schema adaptation.
      expect(detail.priceInfo.prices.length).toBe(
        detail.pricingDetails.reduce(
          (sum, fee) => sum + fee.feeRecords.length,
          0,
        ),
      );
      const serialized = JSON.stringify(detail);
      for (const forbidden of [
        "all_tokens",
        "token_week",
        "uptimeHh",
        "cacheHite",
        '"latency"',
        '"throughput"',
        '"cache"',
      ]) {
        expect(serialized).not.toContain(forbidden);
      }
      providerCount += detail.providerDetails.length;
      priceCount += detail.priceInfo.prices.length;
    }
    expect(providerCount).toBe(381);
    expect(priceCount).toBe(2378);
    expect(new Set(models.map((model) => model.zhDescription)).size).toBe(257);
  });

  it("combines maker, modalities, providers, parameters and protocol filters", () => {
    const filtered = filterModels({
      q: "gemini",
      manufacturer: ["Google"],
      input: ["TEXT"],
      providers: ["Google Vertex"],
      parameter: ["temperature"],
      protocol: ["chat.completions"],
    });
    expect(filtered.length).toBeGreaterThan(0);
    expect(
      filtered.every(
        (model) =>
          model.provider === "Google" &&
          model.providerNames.includes("Google Vertex") &&
          model.supportedParams.includes("temperature") &&
          model.supportedProtocols.includes("chat.completions") &&
          modalities(model, "INPUT_TYPE").includes("TEXT"),
      ),
    ).toBe(true);
    expect(filterModels({ q: "not-a-real-model-abc" })).toEqual([]);
    for (const kind of ["none", "toggleable", "always"]) {
      const found = filterModels({ reasoning: kind });
      expect(found.length).toBeGreaterThan(0);
      expect(
        found.every((model) =>
          kind === "none"
            ? model.reasoning === 0
            : kind === "always"
              ? model.reasoning === 2
              : [1, 3].includes(model.reasoning),
        ),
      ).toBe(true);
    }
  });

  it("preserves actual price ranges and media units without mixing cached input", () => {
    expect(referencePrice(getModel("openai/gpt-6.2-astra"), "in")).toBe(
      "$8–16 / 百万Tokens",
    );
    expect(referencePrice(getModel("google/gemini-4-neon"), "in")).toBe(
      "$3 / 百万Tokens",
    );
    expect(referencePrice(getModel("google/gemini-4-neon"), "out")).toBe(
      "$15 / 百万Tokens",
    );
    expect(referencePrice(getModel("qwen/qwen3-asr-flash"), "in")).toContain(
      "秒",
    );
    expect(referencePrice(getModel("bfl/flux-2-flex"), "out")).toContain(
      "百万像素",
    );
    expect(
      referencePrice(
        { sourceRegion: "global", inPriceZh: "¥0.00/M", priceInfo: null },
        "in",
      ),
    ).toBe("未公布");
    const free = filterModels({ tier: "free" });
    expect(free).toHaveLength(2);
    expect(free.map((model) => model.name)).toEqual(
      expect.arrayContaining([
        "z-ai/glm-4.7-flash-free",
        "z-ai/glm-4.6v-flash-free",
      ]),
    );
    expect(filterModels({ tier: "discount" })).toHaveLength(16);
    expect(free.every(isReferenceFree)).toBe(true);
  });

  it("does not turn absent specifications into zero", () => {
    expect(formatContext(null)).toBe("未公布");
    expect(formatContext("256000")).toBe("256K");
    expect(formatContext("1000000")).toBe("1M");
  });
});
