import { models } from "./models.js";

const makerOrder = [
  "OpenAI",
  "Anthropic",
  "Google",
  "DeepSeek",
  "Qwen",
  "MiniMax",
];
const makers = [
  ...new Set(models.map((model) => model.provider).filter(Boolean)),
];
export const supportedMakers = [
  ...makerOrder.filter((maker) => makers.includes(maker)),
  ...makers.filter((maker) => !makerOrder.includes(maker)),
];
export const makerLogos = supportedMakers.map((maker) => ({
  src: models.find((model) => model.provider === maker)?.iconUrl,
  alt: maker,
  title: maker,
  href: `/models?manufacturer=${encodeURIComponent(maker)}`,
}));

export const recommendedModels = supportedMakers
  .slice(0, 6)
  .map((maker) => models.find((model) => model.provider === maker))
  .filter(Boolean);

export const newsItems = [
  {
    title: "按任务选择模型",
    label: "模型目录",
    to: "/models",
    description: "按厂商、模态和上下文筛选模型，核对技术规格与参考价格。",
  },
  {
    title: "先看懂模型调用费用",
    label: "计费说明",
    to: "/docs/billing",
    description: "了解计量单位与费用构成，正式报价以服务开通信息为准。",
  },
  {
    title: "比较模型规格",
    label: "选择指南",
    to: "/models/compare",
    description: "从模型市场选择最多三个模型，集中比较上下文、模态与参考价格。",
  },
  {
    title: "Token Plan 方案与额度",
    label: "套餐说明",
    to: "/pricing",
    description: "查看参考权益、用量换算和当前开通状态，规划使用预算。",
  },
  {
    title: "从一次 API 调用开始",
    label: "接入指南",
    to: "/docs/quick-access",
    description: "了解服务地址、密钥和调用方式，按实际服务配置接入。",
  },
  {
    title: "连接你的开发工具",
    label: "工具接入",
    to: "/docs/agent-guides/codex",
    description: "查看 Codex 配置示例，将模型能力接入现有开发工作流。",
  },
];
