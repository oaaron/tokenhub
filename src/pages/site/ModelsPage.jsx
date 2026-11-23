import { useSearchParams, Link } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  GitCompareArrows,
  X,
  Boxes,
  Type,
  Image,
  Music,
  Video,
  Network,
  Workflow,
  ArrowDownUp,
  AudioLines,
  FileAudio,
} from "lucide-react";
import { Button, Input } from "../../design-system";
import {
  models,
  filterModels,
  modalities,
  modalityLabels,
} from "../../content/models.js";
import { ModelCard } from "../../components/site/ModelCard";
import ModelFilters from "../../components/site/ModelFilters";
import { LinkButton } from "../../components/site/LinkButton";
import { useEffect, useRef, useState } from "react";
import ModelAnnouncements from "../../components/site/ModelAnnouncements";
import "../../styles/market.css";
const BATCH_SIZE = 24;
const typeIcons = {
  TEXT: Type,
  IMAGE: Image,
  AUDIO: Music,
  VIDEO: Video,
  EMBEDDING: Network,
  EMBEDDINGS: Network,
  DECISION: Workflow,
  DECISIONS: Workflow,
  RERANK: ArrowDownUp,
  SPEECH: AudioLines,
  TRANSCRIPTION: FileAudio,
};
function CatalogResults({ result, compared, onCompare, showFeature }) {
  const [limit, setLimit] = useState(BATCH_SIZE);
  const sentinel = useRef(null);
  const hasMore = limit < result.length;
  useEffect(() => {
    if (!hasMore || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting))
          setLimit((n) => Math.min(n + BATCH_SIZE, result.length));
      },
      { rootMargin: "500px" },
    );
    if (sentinel.current) observer.observe(sentinel.current);
    return () => observer.disconnect();
  }, [hasMore, limit, result.length]);
  return (
    <>
      <div className="catalog-grid">
        {showFeature && result.length > 0 && <ModelAnnouncements />}
        {result.slice(0, limit).map((model) => (
          <ModelCard
            model={model}
            key={model.slug}
            compared={compared.includes(model.slug)}
            onCompare={onCompare}
          />
        ))}
      </div>
      {result.length > 0 && (
        <div className="catalog-load-status" ref={sentinel}>
          <span role="status">
            已显示 {Math.min(limit, result.length)} / {result.length} 个模型
          </span>
          {hasMore ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setLimit((n) => n + BATCH_SIZE)}
            >
              加载更多模型
            </Button>
          ) : (
            <span>已显示全部模型</span>
          )}
        </div>
      )}
    </>
  );
}
export default function ModelsPage() {
  const [params, setParams] = useSearchParams();
  const query = params.get("q") || "";
  const [search, setSearch] = useState(query);
  const [seenQuery, setSeenQuery] = useState(query);
  if (seenQuery !== query) {
    setSeenQuery(query);
    setSearch(query);
  }
  useEffect(() => {
    if (search === query) return;
    const timer = setTimeout(
      () =>
        setParams(
          (current) => {
            const next = new URLSearchParams(current);
            next.delete("q");
            next.delete("page");
            next.delete("region");
            if (search) next.set("q", search);
            return next;
          },
          { preventScrollReset: true },
        ),
      200,
    );
    return () => clearTimeout(timer);
  }, [search, query, setParams]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const values = {
    q: search,
    input: params.getAll("input"),
    manufacturer: params.getAll("manufacturer"),
    context: params.get("context") || "",
    output: params.get("output") || "",
    tier: params.get("tier") || "all",
    sort: params.get("sort") || "source",
    providers: params.getAll("providers"),
    parameter: params.getAll("parameter"),
    protocol: params.getAll("protocol"),
    reasoning: params.get("reasoning") || "",
  };
  const result = filterModels(values);
  const scoped = filterModels({ ...values, output: "" });
  const compared = params
    .getAll("compare")
    .filter((slug) => models.some((m) => m.slug === slug))
    .slice(0, 3);
  function change(key, value) {
    const next = new URLSearchParams(params);
    next.delete(key);
    next.delete("page");
    next.delete("region");
    (Array.isArray(value) ? value : [value])
      .filter(Boolean)
      .forEach((item) => next.append(key, item));
    setParams(next, { preventScrollReset: true });
  }
  function compare(slug) {
    if (compared.includes(slug))
      change(
        "compare",
        compared.filter((item) => item !== slug),
      );
    else if (compared.length < 3) change("compare", [...compared, slug]);
  }
  const reset = () => {
    setSearch("");
    const next = new URLSearchParams();
    compared.forEach((slug) => next.append("compare", slug));
    setParams(next);
  };
  const active = !!(
    values.q ||
    values.input.length ||
    values.manufacturer.length ||
    values.context ||
    values.output ||
    values.tier !== "all" ||
    values.providers.length ||
    values.parameter.length ||
    values.protocol.length ||
    values.reasoning
  );
  return (
    <div className="site-container market-page">
      <div className="market-layout">
        <div
          className={`filters-container ${filtersOpen ? "filters-visible" : ""}`}
        >
          <ModelFilters values={values} onChange={change} onReset={reset} />
        </div>
        <section className="catalog-section" aria-label="模型目录">
          <div className="catalog-toolbar">
            <div className="catalog-title">
              <h1>模型市场</h1>
              <span>{result.length} 个模型</span>
            </div>
            <Button
              className="mobile-filter-toggle"
              size="sm"
              variant="secondary"
              icon={SlidersHorizontal}
              aria-expanded={filtersOpen}
              onClick={() => setFiltersOpen(!filtersOpen)}
            >
              筛选
            </Button>
            <div className="catalog-actions">
              <Input
                aria-label="搜索模型"
                icon={Search}
                placeholder="搜索模型或厂商"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <label className="sort-control">
                <span className="sr-only">排序</span>
                <select
                  aria-label="模型排序"
                  value={values.sort}
                  onChange={(e) => change("sort", e.target.value)}
                >
                  <option value="source">最新发布</option>
                  <option value="name">模型名称</option>
                  <option value="context">上下文长度</option>
                </select>
              </label>
              <div className="price-tabs" aria-label="价格类型">
                {[
                  ["all", "全部"],
                  ["discount", "折扣"],
                  ["free", "免费"],
                ].map(([key, label]) => (
                  <button
                    type="button"
                    key={key}
                    aria-pressed={values.tier === key}
                    onClick={() => change("tier", key)}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <LinkButton
                to={`/models/compare?${compared.map((slug) => `model=${encodeURIComponent(slug)}`).join("&")}`}
                variant="primary"
                size="sm"
              >
                <GitCompareArrows size={16} />
                对比{compared.length ? ` ${compared.length}` : ""}
              </LinkButton>
            </div>
          </div>
          <div className="output-tabs" aria-label="输出模态">
            <button
              type="button"
              aria-pressed={!values.output}
              onClick={() => change("output", "")}
            >
              <Boxes size={17} />
              全部 <span>{scoped.length}</span>
            </button>
            {[
              "TEXT",
              "IMAGE",
              "AUDIO",
              "VIDEO",
              "EMBEDDINGS",
              "DECISIONS",
              "RERANK",
              "SPEECH",
              "TRANSCRIPTION",
            ].map((key) => {
              const Icon = typeIcons[key] || Type;
              const count = scoped.filter((m) =>
                modalities(m, "OUTPUT_TYPE").includes(key),
              ).length;
              return (
                <button
                  type="button"
                  key={key}
                  aria-pressed={values.output === key}
                  onClick={() => change("output", key)}
                >
                  <Icon size={17} />
                  {modalityLabels[key]}
                  <span>{count}</span>
                </button>
              );
            })}
          </div>
          {active && (
            <div className="catalog-active-filters">
              <span>当前筛选到 {result.length} 个模型</span>
              <button type="button" onClick={reset}>
                清除筛选 <X size={13} />
              </button>
            </div>
          )}
          <CatalogResults
            key={JSON.stringify(values)}
            result={result}
            compared={compared}
            onCompare={compare}
            showFeature={!active}
          />
          {!result.length && (
            <div className="site-empty">
              <Search size={28} />
              <h2>没有找到匹配的模型</h2>
              <p>试试其他关键词，或重置筛选条件。</p>
              <Button variant="secondary" onClick={reset}>
                重置筛选
              </Button>
            </div>
          )}
        </section>
      </div>
      {compared.length > 0 && (
        <div className="compare-dock">
          <GitCompareArrows size={17} />
          <span>已选择 {compared.length} / 3 个模型</span>
          <LinkButton
            to={`/models/compare?${compared.map((slug) => `model=${encodeURIComponent(slug)}`).join("&")}`}
            size="sm"
          >
            开始对比
          </LinkButton>
          <Button
            variant="ghost"
            size="sm"
            icon={X}
            aria-label="清空对比"
            onClick={() => change("compare", [])}
          />
        </div>
      )}
      <p className="catalog-help">
        需要接入帮助？<Link to="/docs/quick-access">阅读快速接入文档 ↗</Link>
      </p>
    </div>
  );
}
