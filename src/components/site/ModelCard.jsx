import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Copy,
  Check,
  Type,
  Image,
  Music,
  Video,
  FileText,
  Workflow,
  Network,
  ArrowDownUp,
  AudioLines,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  formatContext,
  modalities,
  modalityLabels,
  referencePrice,
} from "../../content/models.js";
import { modelOffers } from "../../config/site";
const icons = {
  TEXT: Type,
  IMAGE: Image,
  AUDIO: Music,
  VIDEO: Video,
  FILE: FileText,
  DECISION: Workflow,
  DECISIONS: Workflow,
  EMBEDDING: Network,
  EMBEDDINGS: Network,
  RERANK: ArrowDownUp,
  SPEECH: AudioLines,
};
function ModalityIcons({ model, type }) {
  const types = modalities(model, type);
  return (
    <span className="model-modality-icons">
      {types.length ? (
        types.map((key) => {
          const Icon = icons[key] || Type;
          return (
            <span key={key} title={modalityLabels[key] || key}>
              <Icon size={17} />
              <span className="sr-only">{modalityLabels[key] || key}</span>
            </span>
          );
        })
      ) : (
        <span>—</span>
      )}
    </span>
  );
}
export function ModelCard({ model, compared, onCompare }) {
  const [copy, setCopy] = useState("");
  useEffect(() => {
    if (!copy) return;
    const id = setTimeout(() => setCopy(""), 2500);
    return () => clearTimeout(id);
  }, [copy]);
  async function copyName() {
    try {
      await navigator.clipboard.writeText(model.name);
      setCopy("已复制");
    } catch {
      setCopy("复制失败，请手动复制");
    }
  }
  const offer = modelOffers[model.slug];
  const price = (direction) =>
    offer
      ? (offer[direction === "in" ? "inputPrice" : "outputPrice"] ?? "待发布")
      : referencePrice(model, direction);
  return (
    <article className="catalog-card">
      <div className="model-card-identity">
        <span className="maker-emblem" aria-hidden="true">
          <img
            loading="lazy"
            src={
              model.iconUrl ||
              `/model-makers/${String(model.provider).toLowerCase()}.png`
            }
            alt=""
            onError={(e) => {
              e.currentTarget.style.display = "none";
              e.currentTarget.parentElement.setAttribute(
                "data-fallback",
                model.provider?.slice(0, 1) || "M",
              );
            }}
          />
        </span>
        <div className="model-card-names">
          <h2>
            <Link to={`/models/${model.slug}`}>
              {model.displayName || model.name}
            </Link>
          </h2>
          <div className="model-id">
            <code>{model.name}</code>
            <button
              type="button"
              onClick={copyName}
              aria-label={`复制模型 ID ${model.name}`}
            >
              {copy === "已复制" ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
        </div>
      </div>
      <p className="model-card-description">
        {model.zhDescription ||
          model.description ||
          "查看模型规格、能力与接入说明。"}
      </p>
      <dl className="model-facts-panel">
        <div>
          <dt>输入类型</dt>
          <dd>
            <ModalityIcons model={model} type="INPUT_TYPE" />
          </dd>
        </div>
        <div>
          <dt>输出类型</dt>
          <dd>
            <ModalityIcons model={model} type="OUTPUT_TYPE" />
          </dd>
        </div>
        <div>
          <dt>输入价格</dt>
          <dd>
            <code>{price("in")}</code>
          </dd>
        </div>
        <div>
          <dt>输出价格</dt>
          <dd>
            <code>{price("out")}</code>
          </dd>
        </div>
        <div>
          <dt>上下文</dt>
          <dd>{formatContext(model.contextLength)}</dd>
        </div>
        <div>
          <dt>最大输出</dt>
          <dd>{formatContext(model.maxCompletionTokens || model.maxTokens)}</dd>
        </div>
      </dl>
      <div className="model-card-bottom">
        {onCompare && (
          <label className="compare-check">
            <input
              type="checkbox"
              checked={!!compared}
              onChange={() => onCompare(model.slug)}
              aria-label={`对比 ${model.displayName}`}
            />
            加入对比
          </label>
        )}
        <Link to={`/models/${model.slug}`}>模型详情</Link>
        <Link className="model-api-link" to={`/models/${model.slug}?tab=api`}>
          API 接入
          <ArrowUpRight size={14} />
        </Link>
      </div>
      {copy && (
        <span className="model-copy-feedback" role="status">
          {copy}
        </span>
      )}
    </article>
  );
}
