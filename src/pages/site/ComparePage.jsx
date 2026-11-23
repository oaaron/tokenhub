import { Link, useSearchParams } from "react-router-dom";
import {
  getModel,
  formatContext,
  referencePrice,
  modalities,
  modalityLabels,
} from "../../content/models.js";
import { LinkButton } from "../../components/site/LinkButton";
export default function ComparePage() {
  const [params] = useSearchParams();
  const selected = [...new Set(params.getAll("model"))]
    .slice(0, 3)
    .map(getModel)
    .filter(Boolean);
  const rows = [
    ["模型 ID", (m) => m.name],
    ["厂商", (m) => m.provider],
    ["上下文", (m) => `${formatContext(m.contextLength)} Token`],
    [
      "最大输出",
      (m) => `${formatContext(m.maxCompletionTokens || m.maxTokens)} Token`,
    ],
    [
      "输入模态",
      (m) =>
        modalities(m, "INPUT_TYPE")
          .map((x) => modalityLabels[x] || x)
          .join(" / ") || "未公布",
    ],
    [
      "输出模态",
      (m) =>
        modalities(m, "OUTPUT_TYPE")
          .map((x) => modalityLabels[x] || x)
          .join(" / ") || "未公布",
    ],
    ["参考输入价", (m) => referencePrice(m, "in")],
    ["参考输出价", (m) => referencePrice(m, "out")],
  ];
  return (
    <div className="site-container standard-page">
      <h1>让模型选择更清晰。</h1>
      <p className="muted">
        最多比较 3 个模型。价格用于估算，正式报价尚未发布。
      </p>
      {selected.length ? (
        <div className="table-scroll compare-table">
          <table>
            <thead>
              <tr>
                <th>规格</th>
                {selected.map((m) => (
                  <th key={m.slug}>
                    <Link to={`/models/${m.slug}`}>{m.displayName}</Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(([name, value]) => (
                <tr key={name}>
                  <th>{name}</th>
                  {selected.map((m) => (
                    <td key={m.slug}>{value(m)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="site-empty">
          <h2>先选择需要比较的模型</h2>
          <p>在模型市场勾选卡片上的“对比”，再进入此页面。</p>
        </div>
      )}
      <LinkButton to="/models" variant="secondary">
        返回模型市场
      </LinkButton>
    </div>
  );
}
