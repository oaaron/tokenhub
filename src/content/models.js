import snapshot from "./models-zenmux.json";
// Archived CN/SG catalogs remain on disk; only the verified ZenMux catalog is active.
export const models = snapshot;
export const regions = [{ key: "global", label: "全部模型" }];
export const modalityLabels = {
  TEXT: "文本",
  IMAGE: "图像",
  AUDIO: "音频",
  VIDEO: "视频",
  FILE: "文件",
  EMBEDDINGS: "向量嵌入",
  RERANK: "重排序",
  SPEECH: "语音",
  TRANSCRIPTION: "语音转写",
  DECISIONS: "结构化决策",
};
export const modalities = (model, type) => [
  ...new Set(
    (model.tagList || [])
      .filter((tag) => tag.type === type)
      .map((tag) => tag.key),
  ),
];
export const manufacturers = [
  ...new Set(models.map((model) => model.provider).filter(Boolean)),
].sort();
export const getModel = (slug) =>
  models.find((model) => model.slug === slug || model.name === slug);
export const formatContext = (value) => {
  if (value == null || value === "") return "未公布";
  const number = Number(value);
  if (!Number.isFinite(number)) return String(value);
  return number >= 1e6
    ? `${+(number / 1e6).toFixed(2)}M`
    : number >= 1000
      ? `${+(number / 1000).toFixed(2)}K`
      : String(number);
};
export function filterModels({
  q = "",
  region = "",
  input = [],
  manufacturer = [],
  providers = [],
  parameter = [],
  protocol = [],
  reasoning = "",
  context = "",
  output = "",
  tier = "all",
  sort = "source",
} = {}) {
  const ranges = {
    small: [0, 64000],
    medium: [64000, 128000],
    large: [128000, 256000],
    xl: [256000, 1000000],
    huge: [1000000, Infinity],
  };
  const found = models.filter((model) => {
    if (
      region &&
      region !== "all" &&
      !(Array.isArray(region) ? region : [region]).includes(model.sourceRegion)
    )
      return false;
    if (
      !`${model.name} ${model.displayName} ${model.provider}`
        .toLowerCase()
        .includes(q.toLowerCase().trim())
    )
      return false;
    if (
      input.length &&
      !input.every((item) => modalities(model, "INPUT_TYPE").includes(item))
    )
      return false;
    if (manufacturer.length && !manufacturer.includes(model.provider))
      return false;
    if (
      providers.length &&
      !providers.some((name) => model.providerNames?.includes(name))
    )
      return false;
    if (
      parameter.length &&
      !parameter.every((name) => model.supportedParams?.includes(name))
    )
      return false;
    if (
      protocol.length &&
      !protocol.every((name) => model.supportedProtocols?.includes(name))
    )
      return false;
    const reasoningKind =
      Number(model.reasoning) === 0
        ? "none"
        : Number(model.reasoning) === 2
          ? "always"
          : "toggleable";
    if (reasoning && reasoning !== "all" && reasoningKind !== reasoning)
      return false;
    if (output && !modalities(model, "OUTPUT_TYPE").includes(output))
      return false;
    if (context && ranges[context]) {
      const n = Number(model.contextLength);
      const [min, max] = ranges[context];
      if (!model.contextLength || n < min || n > max) return false;
    }
    if (
      tier === "discount" &&
      !(Number(model.minDiscountRate) > 0 && Number(model.minDiscountRate) < 1)
    )
      return false;
    if (tier === "free" && !isReferenceFree(model)) return false;
    return true;
  });
  if (sort === "name")
    found.sort((a, b) => a.displayName.localeCompare(b.displayName));
  if (sort === "context")
    found.sort(
      (a, b) => Number(b.contextLength || 0) - Number(a.contextLength || 0),
    );
  return found;
}
export function isReferenceFree(model) {
  if (typeof model.isFree === "boolean") return model.isFree;
  const prices = (model.priceInfo?.prices || [])
    .flatMap((stage) => stage.price || [])
    .filter((price) => price.priceValue != null);
  return (
    prices.length > 0 && prices.every((price) => Number(price.priceValue) === 0)
  );
}
export function referencePrice(model, direction) {
  const wanted = direction === "in" ? "INPUT" : "OUTPUT";
  const prices = (model.priceInfo?.prices || [])
    .flatMap((stage) =>
      (stage.price || []).map((price) => ({
        ...price,
        priceCurrency:
          price.priceCurrency || stage.priceCurrency || model.currency,
      })),
    )
    .filter(
      (price) =>
        price.priceValue != null &&
        price.priceValue !== "" &&
        Number.isFinite(Number(price.priceValue)),
    );
  // Primary prompt/completion prices are not interchangeable with cache or search charges.
  const primary = prices.filter((price) => price.priceCode === wanted);
  const candidates = primary.length
    ? primary
    : prices.filter(
        (price) =>
          price.direction === wanted &&
          !String(price.sourceFeeCode || price.priceCode)
            .toLowerCase()
            .includes("cache"),
      );
  if (!candidates.length) return "未公布";
  const groups = new Map();
  for (const price of candidates) {
    const key = `${price.priceCurrency}|${price.unitCode}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(price);
  }
  return [...groups.values()]
    .map((items) => {
      const min = Math.min(...items.map((item) => Number(item.priceValue)));
      const max = Math.max(...items.map((item) => Number(item.priceValue)));
      const currency = items[0].priceCurrency;
      const prefix =
        currency === "USD"
          ? "$"
          : currency === "CNY"
            ? "¥"
            : `${currency || ""} `;
      const unit =
        items[0].fixedNameZh ||
        items[0].unitNameZh ||
        items[0].unitCode ||
        "未公布单位";
      return `${prefix}${min === max ? min : `${min}–${max}`} / ${unit}`;
    })
    .join("；");
}
