import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Copy,
  Check,
  Code2,
  Layers3,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button, Card } from "../../design-system";
import {
  getModel,
  formatContext,
  modalities,
  modalityLabels,
} from "../../content/models.js";
import { CodeExample } from "../../components/site/CodeExample";
import { modelExampleGroups } from "../../content/modelExamples";
import { LinkButton } from "../../components/site/LinkButton";
import { loadModelDetail } from "../../content/modelDetails";
import { siteConfig } from "../../config/site";
import NotFoundPage from "./NotFoundPage";
function formatConstraint(constraint) {
  if (typeof constraint === "string") return constraint;
  let value = constraint.value;
  try {
    value = JSON.parse(value);
  } catch {
    /* Keep textual choices. */
  }
  if (
    value &&
    typeof value === "object" &&
    ("lowerLimit" in value || "upperLimit" in value)
  ) {
    return `${constraint.name || constraint.code}：${value.includeLowerLimit ? "[" : "("}${value.lowerLimit ?? "−∞"}, ${value.upperLimit ?? "+∞"}${value.includeUpperLimit ? "]" : ")"}`;
  }
  return `${constraint.name || constraint.code}：${typeof value === "object" ? JSON.stringify(value) : value}`;
}
function PriceTable({ model }) {
  const providers = model.providerDetails?.length
    ? model.providerDetails
    : [{ name: model.provider, priceInfo: model.priceInfo }];
  return (
    <>
      <div className="section-heading-inline">
        <h2>计价信息</h2>
      </div>
      <p className="muted">
        请结合计量项、单位与阶梯条件估算费用，实际结算以服务开通时的报价为准。
      </p>
      {providers.map((provider, index) => {
        const stages = provider.priceInfo?.prices || [];
        return (
          <details
            className="provider-pricing"
            open={index === 0}
            key={provider.slug || index}
          >
            <summary>{provider.name} · 计价明细</summary>
            {stages.length ? (
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>计量项</th>
                      <th>价格</th>
                      <th>币种</th>
                      <th>单位</th>
                      <th>适用条件</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stages.flatMap((stage, si) =>
                      (stage.price || []).map((price, pi) => (
                        <tr key={`${si}-${pi}`}>
                          <td>
                            {price.priceNameZH ||
                              price.priceName ||
                              price.priceCode}
                          </td>
                          <td className="numeric-price">
                            {price.priceValue == null
                              ? "未公布"
                              : Number(price.priceValue).toLocaleString(
                                  "en-US",
                                  {
                                    maximumFractionDigits: 12,
                                    useGrouping: false,
                                  },
                                )}
                          </td>
                          <td>
                            {price.priceCurrency ||
                              stage.priceCurrency ||
                              model.currency ||
                              "未公布"}
                          </td>
                          <td>
                            {price.fixedNameZh ||
                              price.unitNameZh ||
                              price.unitCode ||
                              "未公布"}
                          </td>
                          <td>
                            {price.constraints?.length
                              ? price.constraints
                                  .map(formatConstraint)
                                  .join("；")
                              : stage.stageText || stage.stage || "标准条件"}
                          </td>
                        </tr>
                      )),
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>具体计价尚未公布。</p>
            )}
          </details>
        );
      })}
    </>
  );
}
export default function ModelDetailPage() {
  const { modelId } = useParams();
  const [detail, setDetail] = useState(null);
  const [loadError, setLoadError] = useState("");
  const model = detail?.slug === modelId ? detail : getModel(modelId);
  useEffect(() => {
    let current = true;
    loadModelDetail(modelId)
      .then((value) => {
        if (current) {
          setDetail(value);
          setLoadError("");
        }
      })
      .catch(() => {
        if (current) setLoadError("模型详情加载失败，请刷新页面重试。");
      });
    return () => {
      current = false;
    };
  }, [modelId]);
  const [params, setParams] = useSearchParams();
  const [copy, setCopy] = useState("");
  if (!model) return <NotFoundPage />;
  const tab = params.get("tab") === "api" ? "api" : "intro";
  const protocols =
    model.protocolParameters ||
    (model.providerDetails || []).flatMap((provider) =>
      Object.entries(provider.apiProtocols || {}).map(([name, spec]) => ({
        protocolName: `${provider.slug}:${name}`,
        displayName: `${provider.name} · ${name}`,
        parameters: Object.fromEntries(
          (spec.supported_parameters || []).map((key) => [key, true]),
        ),
      })),
    );
  const parameters =
    model.modelParameters || model.supportedParametersDefaultValue;
  const exampleGroups = modelExampleGroups(model);
  async function copyId() {
    try {
      await navigator.clipboard.writeText(model.name);
      setCopy("已复制");
    } catch {
      setCopy("复制失败，请手动复制");
    }
  }
  return (
    <div className="site-container detail-page">
      <Link className="back-link" to="/models">
        <ArrowLeft size={14} /> 返回模型市场
      </Link>
      <div className="model-detail-heading">
        <span className="detail-model-icon">
          <Layers3 size={30} />
        </span>
        <div>
          <div className="detail-source-label">{model.provider}</div>
          <h1>{model.displayName || model.name}</h1>
          <div className="detail-model-id">
            <code>{model.name}</code>
            <Button
              size="sm"
              variant="ghost"
              icon={copy === "已复制" ? Check : Copy}
              onClick={copyId}
            >
              复制模型 ID
            </Button>
            <span role="status">{copy}</span>
          </div>
        </div>
        <LinkButton to={`/models/${model.slug}?tab=api`} variant="primary">
          <Code2 size={16} /> API 接入说明
        </LinkButton>
      </div>
      <div className="detail-tabbar" role="tablist" aria-label="模型信息">
        <button
          role="tab"
          aria-selected={tab === "intro"}
          onClick={() => setParams({ tab: "intro" })}
        >
          介绍与规格
        </button>
        <button
          role="tab"
          aria-selected={tab === "api"}
          onClick={() => setParams({ tab: "api" })}
        >
          API 调用
        </button>
      </div>
      <div className="detail-columns">
        <article className="detail-article">
          {loadError && (
            <div role="alert" className="notice-box">
              {loadError}
            </div>
          )}
          {detail?.slug !== modelId && !loadError && (
            <p role="status">正在加载完整技术规格…</p>
          )}
          {tab === "intro" ? (
            <>
              <h2>模型介绍</h2>
              <div className="model-long-description">
                {(
                  model.zhLongDescription ||
                  model.zhDescription ||
                  model.longDescription ||
                  model.description ||
                  "详细介绍暂未提供。"
                )
                  .split(/\n+/)
                  .map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
              </div>
              <div className="technical-facts">
                <span>
                  输入模态
                  <strong>
                    {modalities(model, "INPUT_TYPE")
                      .map((x) => modalityLabels[x] || x)
                      .join(" / ") || "未公布"}
                  </strong>
                </span>
                <span>
                  输出模态
                  <strong>
                    {modalities(model, "OUTPUT_TYPE")
                      .map((x) => modalityLabels[x] || x)
                      .join(" / ") || "未公布"}
                  </strong>
                </span>
                <span>
                  上下文
                  <strong>{formatContext(model.contextLength)} Token</strong>
                </span>
                <span>
                  最大输出
                  <strong>
                    {formatContext(
                      model.maxCompletionTokens || model.maxTokens,
                    )}{" "}
                    Token
                  </strong>
                </span>
              </div>
              <h2>供应商</h2>
              <p className="muted">
                以下列出可查阅的供应商信息，实际可用范围以服务开通配置为准。
              </p>
              <div className="provider-grid">
                {(model.providerDetails || model.providers || []).map(
                  (provider) => (
                    <Card key={provider.slug || provider.providerUid}>
                      <strong>
                        {provider.name ||
                          provider.providerDisplayName ||
                          provider.providerName}
                      </strong>
                      <code>{provider.slug || provider.providerName}</code>
                      {provider.contextLength != null && (
                        <p>
                          上下文 {formatContext(provider.contextLength)} ·
                          最大输出 {formatContext(provider.maxCompletionTokens)}
                        </p>
                      )}
                    </Card>
                  ),
                )}
              </div>
              <PriceTable model={model} />
              <h2>协议与参数</h2>
              {protocols.length ? (
                protocols.map((protocol) => (
                  <details
                    className="protocol-details"
                    key={protocol.protocolName}
                  >
                    <summary>
                      {protocol.displayName || protocol.protocolName}
                    </summary>
                    <div className="parameter-tags">
                      {Object.entries(protocol.parameters || {})
                        .filter(([, enabled]) => enabled)
                        .map(([name]) => (
                          <code key={name}>{name}</code>
                        ))}
                    </div>
                  </details>
                ))
              ) : (
                <p className="muted">协议参数暂未公布。</p>
              )}
              {parameters && Object.keys(parameters).length > 0 && (
                <details className="protocol-details">
                  <summary>完整参数定义</summary>
                  <pre className="raw-json">
                    {JSON.stringify(parameters, null, 2)}
                  </pre>
                </details>
              )}
            </>
          ) : (
            <>
              <h2>调用 {model.displayName}</h2>
              <p>
                按需选择模型，在服务端读取环境变量中的 API
                地址与密钥。参数和协议支持情况请核对模型规格。
              </p>
              {!siteConfig.apiBaseUrl && (
                <div className="notice-box">
                  Velink 服务地址尚未配置。示例中的
                  VELINK_API_ROOT_URL（不含 /v1）及 VELINK_API_BASE_URL（含
                  /v1）需设置为实际开通地址；此页面不会发送推理请求。
                </div>
              )}
              {exampleGroups.length ? (
                exampleGroups.map((group) => (
                  <section key={group.protocol}>
                    <h3>{group.protocol}</h3>
                    {group.issues?.map((issue, index) => (
                      <div key={index} className="notice-box" role="note">
                        {issue.language} 示例暂不可用：{issue.reason}
                      </div>
                    ))}
                    <CodeExample examples={group.examples} />
                  </section>
                ))
              ) : (
                <div className="notice-box">
                  此模型暂无可用调用示例。请先核对协议与参数，查看接入文档或联系服务方。
                </div>
              )}
              <h2>进一步接入</h2>
              <div className="access-links">
                <Link to="/docs/quick-access">
                  快速接入 <ArrowRight size={16} />
                </Link>
                <Link to="/docs/choose-provider">
                  选择供应商 <ArrowRight size={16} />
                </Link>
                <Link to="/docs/agent-guides/codex">
                  Codex 接入 <ArrowRight size={16} />
                </Link>
                <Link to="/docs/agent-guides/opencode">
                  OpenCode 接入 <ArrowRight size={16} />
                </Link>
              </div>
            </>
          )}
        </article>
        <aside className="model-detail-aside">
          <Card>
            <h3>模型规格</h3>
            <dl>
              <dt>厂商</dt>
              <dd>{model.provider}</dd>
              <dt>上下文</dt>
              <dd>{formatContext(model.contextLength)} Token</dd>
              <dt>发布日期</dt>
              <dd>{model.publishedTime || "未公布"}</dd>
              <dt>Velink 服务状态</dt>
              <dd>等待开通配置</dd>
            </dl>
            <LinkButton
              to="/service-status?service=account"
              variant="secondary"
            >
              查看接入状态 <ArrowUpRightIcon />
            </LinkButton>
          </Card>
        </aside>
      </div>
    </div>
  );
}
function ArrowUpRightIcon() {
  return <ArrowRight size={14} />;
}
