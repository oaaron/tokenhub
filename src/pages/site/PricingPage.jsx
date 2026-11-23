import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  Check,
  Layers3,
  ShieldCheck,
  Zap,
  Network,
  Wallet,
  Code2,
} from "lucide-react";
import { Card } from "../../design-system";
import { LinkButton } from "../../components/site/LinkButton";
import { plans } from "../../content/plans";
import { planOffers, purchaseTarget, siteConfig } from "../../config/site";
const planBenefits = [
  [
    "按任务选择模型",
    "结合能力、上下文和费用选择模型，接入范围以开通配置为准。",
  ],
  ["核对输入输出", "文本、图像、音视频等任务应分别核对模型的模态和限制。"],
  ["连接开发工具", "使用与模型协议兼容的工具，并按接入文档完成配置。"],
  ["规划使用预算", "根据请求频率和输入输出规模评估用量。"],
  ["明确数据边界", "数据处理与隐私要求以正式服务协议为准。"],
  ["保护接入密钥", "在服务端读取密钥，避免将凭证暴露在网页中。"],
];
const planFAQ = [
  {
    title: "购买与权益",
    items: [
      [
        "现在可以购买套餐吗？",
        "正式报价和购买入口尚未开放，当前选择方案不会创建订单或扣款。",
      ],
      [
        "套餐包含哪些模型？",
        "模型目录用于查看能力，套餐模型、额度和有效期将在正式开通时确认。",
      ],
      [
        "是否支持续订、叠加和退款？",
        "相关交易规则尚未发布，请以正式服务条款为准。",
      ],
    ],
  },
  {
    title: "用量与接入",
    items: [
      [
        "如何估算模型用量？",
        "结合模型计量单位、输入输出规模和调用频率计算。对话、图片和视频换算均为估算示例。",
      ],
      [
        "怎样查看实际用量？",
        "账户服务尚未开放，当前不展示实时余额或账单。开通后应以实际账单核对消费。",
      ],
      [
        "如何配置 API Key？",
        "查看快速接入文档，在服务端或本地安全环境保存真实密钥，并核对服务地址与协议。",
      ],
    ],
  },
];
const icons = [Layers3, Network, Code2, Wallet, ShieldCheck, Zap];
export default function PricingPage() {
  const [params, setParams] = useSearchParams();
  const [faqGroup, setFaqGroup] = useState(0);
  const selected =
    plans.find((plan) => plan.id === params.get("plan")) || plans[1];
  return (
    <div className="site-container pricing-page">
      <div className="page-heading centered">
        <h1>
          选择适合你的<span>下一步。</span>
        </h1>
        <p>
          以统一的额度，连接模型、智能体与多模态工作流。
          <br />
          了解方案规格，清晰规划每个月的 AI 使用。
        </p>
        <div className="pricing-meta">
          <span className="monthly-pill">月度方案</span>
          <Link to={siteConfig.accountUrl || "/service-status?service=account"}>
            我的订阅 <ArrowRight size={13} />
          </Link>
        </div>
      </div>
      <div className="notice-box pricing-notice">
        Velink
        正式价格、额度及购买服务尚未发布。下方方案规格用于预算规划，最终权益以开通时的说明为准。
      </div>
      <div className="plan-announcement">
        <span>使用说明</span>
        <p>先核对模型能力与计量方式，再按任务频率评估月度预算。</p>
        <Link to="/docs/billing">
          查看计费说明 <ArrowRight size={14} />
        </Link>
      </div>
      <div className="plan-grid">
        {plans.map((plan, index) => {
          const offer = planOffers[plan.id];
          return (
            <Card
              key={plan.id}
              className={`plan-card ${selected.id === plan.id ? "is-selected" : ""}`}
            >
              <div className="plan-topline">
                <span className="plan-icon">
                  <Layers3 size={20} />
                </span>
                <span>月度参考方案</span>
                {selected.id === plan.id && (
                  <span className="selected-badge">
                    <Check size={11} /> 已选择
                  </span>
                )}
              </div>
              <h2>{plan.name}</h2>
              <p>{plan.description}</p>
              <div className="plan-price">
                {offer.monthlyPrice == null ? (
                  <strong className="pending-price">价格待发布</strong>
                ) : (
                  <strong>
                    {offer.currency === "USD" ? "$" : "¥"}
                    {offer.monthlyPrice}
                    <small>/ 月</small>
                  </strong>
                )}
              </div>
              <div className="plan-credit">
                {(offer.creditAmount ?? plan.referenceCredits).toLocaleString()}{" "}
                <span>积分 / 月</span>
                <small>
                  {offer.creditAmount == null
                    ? "规划额度 · 待正式开通"
                    : "Velink 套餐额度"}
                </small>
              </div>
              <button
                type="button"
                className={`ds-button ds-button--md ds-button--${selected.id === plan.id ? "primary" : "secondary"} plan-select`}
                aria-pressed={selected.id === plan.id}
                onClick={() => setParams({ plan: plan.id, period: "monthly" })}
              >
                {selected.id === plan.id ? "已选择此方案" : "选择方案"}
              </button>
              <ul>
                {plan.referenceUsage.map((item) => (
                  <li key={item}>
                    <Check size={12} />
                    {item}
                  </li>
                ))}
              </ul>
              <small className="usage-disclaimer">
                用量换算仅用于估算，并非固定可用次数。
              </small>
              <span className="plan-number">0{index + 1}</span>
            </Card>
          );
        })}
      </div>
      <div className="selected-plan-bar">
        <div>
          <span>当前选择</span>
          <strong>
            {selected.name} <small>/ 月度</small>
          </strong>
        </div>
        <p>额度与结算规则将在正式开通时确认。</p>
        <LinkButton to={purchaseTarget(selected.id)}>
          {planOffers[selected.id].purchaseUrl || siteConfig.purchaseUrl
            ? "前往购买"
            : "查看开通状态"}{" "}
          <ArrowRight size={15} />
        </LinkButton>
      </div>
      <section className="pricing-section">
        <div className="section-intro">
          <div>
            <h2>按任务核对模型能力</h2>
          </div>
          <Link to="/docs/token-plan-agent">
            查看套餐参考文档 <ArrowRight size={14} />
          </Link>
        </div>
        <p className="muted">
          以下为选择模型时可核对的能力维度，具体权益与可用模型以正式开通清单为准。
        </p>
        <div className="matrix-grid">
          {[
            ["文本与推理", "核对任务复杂度、上下文长度、输出上限与响应要求。"],
            ["代码与智能体", "核对工具调用、代码能力及开发工具支持的协议。"],
            ["图像与视觉", "区分图像理解、生成与编辑，确认输入输出模态。"],
            ["视频与语音", "核对媒体时长、规格、计量方式与异步任务支持。"],
            ["向量与重排", "按检索场景确认向量维度、批量限制与重排能力。"],
            ["用量与预算", "结合调用频率、输入输出规模与价格单位估算预算。"],
          ].map(([title, text]) => (
            <Card key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </Card>
          ))}
        </div>
      </section>
      <section className="pricing-section">
        <div className="section-intro">
          <div>
            <h2>让每一份额度，都有清晰去向。</h2>
          </div>
        </div>
        <div className="benefits-grid">
          {planBenefits.map(([title, text], i) => {
            const Icon = icons[i];
            return (
              <div key={title}>
                <Icon size={21} />
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            );
          })}
        </div>
      </section>
      <section className="pricing-section faq-section">
        <div className="section-intro">
          <div>
            <h2>常见问题</h2>
          </div>
        </div>
        <p className="muted">交易与服务条件将在正式开通时发布。</p>
        <div className="faq-tabs" role="tablist" aria-label="常见问题分类">
          {planFAQ.map((group, index) => (
            <button
              role="tab"
              aria-selected={index === faqGroup}
              type="button"
              key={group.title}
              onClick={() => setFaqGroup(index)}
            >
              {group.title}
            </button>
          ))}
        </div>
        <div role="tabpanel" className="faq-list" key={faqGroup}>
          {planFAQ[faqGroup].items.map(([question, answer], index) => (
            <details key={question} open={index === 0}>
              <summary>{question}</summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
