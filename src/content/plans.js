export const plans = [
  {
    id: "Go",
    name: "探索版",
    english: "Explore",
    referencePrice: "29",
    referenceCredits: 3750,
    description: "从一个想法，走向第一个应用。",
    referenceUsage: ["约 7,500 次对话", "约 180 张高清图", "约 38 秒视频"],
  },
  {
    id: "Build",
    name: "构建版",
    english: "Build",
    referencePrice: "189",
    referenceCredits: 27500,
    description: "为持续构建的工作流留出空间。",
    referenceUsage: ["约 55,000 次对话", "约 1,320 张高清图", "约 4 分钟视频"],
  },
  {
    id: "Advance",
    name: "进阶版",
    english: "Advance",
    referencePrice: "689",
    referenceCredits: 100000,
    description: "承载更复杂的任务与团队协作。",
    referenceUsage: [
      "约 200,000 次对话",
      "约 4,800 张高清图",
      "约 16 分钟视频",
    ],
  },
  {
    id: "Scale",
    name: "规模版",
    english: "Scale",
    referencePrice: "1289",
    referenceCredits: 200000,
    description: "面向更高频的应用与生产需求。",
    referenceUsage: [
      "约 400,000 次对话",
      "约 9,600 张高清图",
      "约 33 分钟视频",
    ],
  },
];
export const modelMatrix = [
  [
    "文本与推理",
    "Ling 系列 / Qwen 系列 / DeepSeek 系列 / MiniMax 系列 / Kimi 系列 / GLM 系列 / StepFun 系列",
  ],
  ["视觉理解", "Ling-VL / Qwen3-VL"],
  ["代码生成", "Qwen3 Coder / Kimi Code"],
  ["图像生成", "Qwen-Image 系列 / Wan Image 系列"],
  ["视频生成与编辑", "Wan Video 系列 / HappyHorse 系列"],
  ["语音识别与合成", "Qwen3-ASR 系列 / Qwen3-TTS 系列"],
  ["向量与重排", "text-embedding-v4 / Qwen3-Rerank"],
  ["场景模型", "Ling-Sante 医疗场景 / Ling-Fin 金融场景"],
];
export const planBenefits = [
  ["多模型灵活切换", "原站以统一 Credits 结算，切换套餐内模型不需要分别开通。"],
  [
    "全模态覆盖",
    "覆盖文本、图像、视频、语音与向量等能力，具体模型以支持清单为准。",
  ],
  [
    "兼容 Agent / Coding 工具",
    "通过兼容协议连接编程与智能体工具，接入方式见文档。",
  ],
  ["预算可控", "月度固定额度，关注周期与剩余额度，避免意外中断。"],
  ["数据处理透明", "数据使用与隐私条款须以正式生效的服务协议为准。"],
  ["标准 API 接入", "通过服务端 API 集成现有系统，无需在前端暴露密钥。"],
];
// Rewritten source rules. These describe the reference platform, not unconfigured Velink service terms.
export const planFAQ = [
  {
    title: "购买",
    items: [
      [
        "可以同时购买多个套餐吗？",
        "原站允许购买多个额度叠加包，合并使用其额度。Velink 的叠加购买能力与入口尚未开放。",
      ],
      [
        "Token Plan for Agent 提供哪些套餐版本？",
        "原站目前公开展示探索、构建、进阶和规模四档月付方案，区别主要为 Credits 额度。Velink 的价格与额度以正式发布为准。",
      ],
      [
        "套餐是否支持退订？",
        "原站的 Token Plan for Agent 规则为不支持退款。Velink 尚未开放交易，退订条件以未来正式服务条款为准。",
      ],
      [
        "套餐如何续订？",
        "原站按月订阅，可在订阅页面续订，也允许在额度不足时新购叠加包。本站尚未配置订阅或自动扣款。",
      ],
      [
        "套餐到期后未用完的额度会怎样？",
        "原站额度按计费周期发放，到期余额不结转、也不退款；新周期重新计算额度。",
      ],
    ],
  },
  {
    title: "计费与额度",
    items: [
      [
        "Credits 抵扣规则是什么？",
        "原站将不同模型的输入、缓存、输出及其他计量项换算为 Credits。同账号的密钥共享额度，耗尽时暂停服务，需等待新周期或补充叠加包。",
      ],
      [
        "为什么订阅了 Token Plan for Agent，仍然产生了按量计费账单？",
        "原站的按量付费密钥与套餐密钥分别计费。使用按量付费密钥不会抵扣套餐额度，应检查工具中实际配置的密钥类型。",
      ],
      [
        "多个 API Key 之间额度怎么共享？",
        "原站同账号的多个套餐密钥共用一个额度池，无需逐个分配；任意密钥调用都会扣减共享余额。",
      ],
      [
        "单次请求大概消耗多少 Credits？",
        "消耗会随模型、Token 数量、思考模式和工具使用而变化。原站给出的 qwen3.6-plus 单次约 3.18 Credits 仅为示例，结算须核对实际账单。",
      ],
      [
        "视频、生图模型怎么计费？",
        "原站也使用 Credits 抵扣。示例为 happyhorse-1.0-i2v 生成 720P、3 秒视频约 270 Credits，qwen-image-2.0 生成 2 张图约 40 Credits；并非所有输入条件下的固定价格。",
      ],
    ],
  },
  {
    title: "接入与配置",
    items: [
      [
        "什么是 Token Plan for Agent 专属 API Key？",
        "原站使用专属套餐密钥识别额度抵扣。在密钥管理中查看套餐类型；按量付费凭证不能用于抵扣套餐额度。",
      ],
      [
        "Token Plan for Agent 支持使用哪些模型？",
        "原站套餐包含 Ling、Ring 及部分第三方模型，具体名称以套餐模型列表为准。模型市场收录并不等同于套餐支持。",
      ],
      [
        "Token Plan for Agent 支持哪些 AI 工具？",
        "原站兼容支持 OpenAI 或 Anthropic 协议的工具，例如 Qwen Code、Claude Code、OpenClaw 和 OpenCode。具体协议须与模型的支持能力匹配。",
      ],
      [
        "如何在多个模型之间切换？",
        "原站通过请求中的模型名称选择目标模型，无需因切换套餐内模型而替换凭证，额度仍统一以 Credits 扣减。",
      ],
    ],
  },
  {
    title: "产品功能",
    items: [
      [
        "Token Plan for Agent 可以生成多个 API Key 吗？",
        "原站一个订阅允许创建多个共享额度的专属密钥，并支持单独重置泄漏的凭证；重置后原值失效。Velink 的账户接口尚未开放。",
      ],
      [
        "如何查看套餐用量？",
        "原站可在 Token Plan for Agent 订阅页面刷新用量。本站未连接账户数据，不显示模拟余额或虚构用量。",
      ],
    ],
  },
];
