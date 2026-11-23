import { useState } from "react";
import { models, manufacturers, modalityLabels } from "../../content/models.js";
import { Button } from "../../design-system";
function FilterList({ label, items, selected, onToggle }) {
  const [expanded, setExpanded] = useState(false);
  if (!items.length) return null;
  return (
    <details open>
      <summary>{label}</summary>
      <div className="filter-options">
        {(expanded ? items : items.slice(0, 5)).map((item) => (
          <label key={item}>
            <input
              type="checkbox"
              checked={selected.includes(item)}
              onChange={() => onToggle(item)}
            />
            <span>{item}</span>
          </label>
        ))}
      </div>
      {items.length > 5 && (
        <button
          className="filter-expand"
          type="button"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "收起" : "展开更多"}
        </button>
      )}
    </details>
  );
}
export default function ModelFilters({ values, onChange, onReset }) {
  const toggle = (key, value) => {
    const current = values[key] || [];
    onChange(
      key,
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    );
  };
  const options = (key) =>
    [...new Set(models.flatMap((m) => m[key] || []))].sort();
  return (
    <aside className="model-filters" aria-label="模型筛选">
      <div className="filters-heading">
        <strong>筛选模型</strong>
        <Button size="sm" variant="ghost" onClick={onReset}>
          重置
        </Button>
      </div>
      <details open>
        <summary>输入类型</summary>
        <div className="filter-options">
          {["TEXT", "IMAGE", "FILE", "AUDIO", "VIDEO"].map((key) => (
            <label key={key}>
              <input
                type="checkbox"
                checked={values.input.includes(key)}
                onChange={() => toggle("input", key)}
              />
              {modalityLabels[key]}
            </label>
          ))}
        </div>
      </details>
      <details open>
        <summary>上下文长度</summary>
        <div className="context-options">
          {[
            ["small", "≤64K"],
            ["medium", "64K–128K"],
            ["large", "128K–256K"],
            ["xl", "256K–1M"],
            ["huge", "≥1M"],
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              aria-pressed={values.context === key}
              onClick={() =>
                onChange("context", values.context === key ? "" : key)
              }
            >
              {label}
            </button>
          ))}
        </div>
      </details>
      <FilterList
        label="模型厂商"
        items={manufacturers}
        selected={values.manufacturer}
        onToggle={(item) => toggle("manufacturer", item)}
      />
      <FilterList
        label="供应商"
        items={options("providerNames")}
        selected={values.providers}
        onToggle={(item) => toggle("providers", item)}
      />
      <FilterList
        label="支持的参数"
        items={options("supportedParams")}
        selected={values.parameter}
        onToggle={(item) => toggle("parameter", item)}
      />
      <FilterList
        label="支持的协议"
        items={options("supportedProtocols")}
        selected={values.protocol}
        onToggle={(item) => toggle("protocol", item)}
      />
      <details open>
        <summary>推理方式</summary>
        <div className="filter-options">
          {[
            ["none", "无推理"],
            ["toggleable", "可切换推理"],
            ["always", "始终开启推理"],
          ].map(([key, label]) => (
            <label key={key}>
              <input
                type="radio"
                name="reasoning"
                checked={values.reasoning === key}
                onChange={() => onChange("reasoning", key)}
              />
              {label}
            </label>
          ))}
        </div>
      </details>
    </aside>
  );
}
