// Source text was safely extracted with extract-docs.cjs; editorial summaries below
// are independent Velink wording. Tables and code retain source technical facts.
const fs = require("fs");
const docs = JSON.parse(fs.readFileSync("/tmp/velink-extracted.json"));
const intro = {
  intro:
    "Velink 文档按统一模型接入、调用治理、用量与费用三个方向组织。这里整理参考平台公开资料中的技术流程，帮助开发者理解接入与管理方法。",
  "intro/advantages":
    "统一接口可以减少逐家对接的工作；路由、缓存和渠道回退则分别处理调用路径、重复上下文和上游故障。以下能力描述来自参考平台。",
  "intro/scenarios":
    "根据团队规模、交互时延和输入模态选择接入方式。模型替换前应确认协议、参数、权限和业务效果。",
  "intro/supported-models":
    "以下模型清单来自参考平台公开文档，保留原始模型标识与能力信息。清单用于技术查阅，并不表示 Velink 已开通相应服务。",
  "quick-access":
    "接入分为准备凭证、配置基础地址、发送请求、检查响应四步。代码中的 __API_BASE_URL__ 是待配置的接口地址，VELINK_API_KEY 是服务端环境变量。",
  billing:
    "以下价格表记录参考平台国内站公开的模型调用原价，保留模型、计量条件与单位，供估算方法参考。活动价、折扣及最终费用由参考平台当期规则决定。",
  "billing-guide":
    "参考平台把账单分为月度汇总和分钟明细。核账时需要同时考虑出账延迟、模型计量项和月结精度补差。",
  "token-plan":
    "本页记录参考平台旧版 Token Plan 的订阅与调用次数规则。它与以 Credits 计量的 Token Plan for Agent 分开理解，不能混用额度与凭证。",
  "token-plan-agent":
    "参考平台的 Token Plan for Agent 以 Credits 统一核算编程、Agent 与多模态调用，并使用套餐专属 API Key。具体模型与额度取决于实际订阅。",
  "console/api-key":
    "参考平台区分套餐凭证和按量付费凭证。选择错误的 Key 类型，可能使请求进入不同的计费路径。",
  "console/account-management":
    "参考平台控制台提供用量、成本、订单、工单与账号信息入口。下面说明各入口的用途及其跳转关系。",
  "console/model-marketplace":
    "模型市场用于查找模型、查看参数和比较能力。参考平台要求先购买 Agent 套餐或开通按量付费，才能按相应权限使用。",
  "console/space-management":
    "空间把模型访问、凭证归属、用量统计和预算负责人联系起来。只有统计、预算、权限或运行环境需要隔离时，才需要拆分空间。",
  "model-fallback":
    "参考平台通过 model 指定首选模型，用 models 声明有序备用列表。切换是同一请求内的串行故障处理，不会并发比较多个模型，也不会合并它们的输出。",
  "choose-provider":
    "同一模型可能有多个 Provider。调用方既可以交给默认路由，也可以用 provider 对象限制候选范围或指定优先顺序。",
  "get-model-list":
    "模型列表只反映当前 API Key 的可访问范围。OpenAI 与 Anthropic 兼容端点的分页和响应结构不同，withPrice=true 可附带阶梯价格。",
  "lingdt-decision-api-guide":
    "LingDT-Decision 面向分类、判断、打分等结构化决策。4B 与 27B 服务的规格随版本变化；使用 extract 或 DAG 前应先核对版本能力与服务入口。",
  "platform-api/get-ak-sk":
    "本页记录参考平台服务账号的身份与授权流程。管理类 OpenAPI 使用 AK/SK 签名；模型推理使用 API Key，两套凭证不能替换。",
  "platform-api/query-api-usage":
    "antdigital.dtmaas.apikey.usage.query 按模型汇总指定 API Key 的调用次数及 Token 用量，支持排序与分页。AK/SK 用于管理接口签名，tokenId 指向被查询的 Key。",
  "agent-guides/codex":
    "本页保留参考文档的 Codex CLI 接入流程：通过自定义 Provider 使用 OpenAI Responses 兼容服务。本地仍由 Codex 读写和运行项目，模型请求发送到配置的接口。原文模型示例需结合下线公告阅读。",
  "agent-guides/opencode":
    "OpenCode 可通过自定义 Provider 接入 OpenAI Chat Completions 兼容服务。配置需要同时指定模型、基础地址与认证来源，项目配置可能覆盖全局配置。",
  "about/caict-evaluation":
    "参考平台公告称 DTMaaS 首批通过中国信通院“可信 AI-Token”服务质量评估。本页只记录该平台公告，不表示 Velink 获得相同评估或认证。",
  "about/lingdt-decision-release":
    "参考平台在 10 月 22 日的发布材料中介绍 LingDT-Decision-1.0 的 4B、27B 版本及原生多选、按序决策能力。下列测试数据均属于该平台材料中的实验结果。",
};
// Heading fragments are source headings; summaries explain the source facts anew.
const rules = {
  intro: [
    [
      "平台优势",
      "参考平台列出统一模型 API、Token Plan 以及路由与缓存优化。其“最高节省 20%”“毫秒级响应”“99.5% 可用性”属于原平台宣传口径，适用条件须以其服务约定为准。",
    ],
    [
      "调用 API",
      "请求包含 model 和 messages；认证放在 Authorization: Bearer 中。示例保留原文模型 ID，仅用于说明请求结构。",
    ],
  ],
  "intro/advantages": [
    [
      "统一接入",
      "参考资料以 OpenAI 兼容接口连接 LingDT、Qwen、DeepSeek 等 30 多个模型，模型通过参数选择。",
    ],
    [
      "智能路由",
      "原平台描述了节点调度与故障切换，并公布 99.5% 可用性；该数字不是 Velink 的 SLA。",
    ],
    [
      "成本优化",
      "原平台宣传缓存与路由协同可最高节省 20%；实际结果取决于工作负载与价格条件。",
    ],
  ],
  "intro/scenarios": [
    ["早期初创", "在能力与预算之间安排主备模型，用实际任务验证成本和输出。"],
    ["个人项目", "原文用个人实验说明按任务选择模型的价值。"],
    [
      "实时应用",
      "原平台把对话、助手和交互工具列为低延迟路由场景，并提出亚秒级响应口径。",
    ],
    [
      "灵活切换",
      "模型切换用于减少单一供应商依赖；原文强调可比较模型后调整调用。",
    ],
    ["多模态", "原文覆盖图像、音频、视频与函数调用的统一接入。"],
    ["全球可用", "原平台描述边缘推理与就近节点路由，属于其基础设施能力介绍。"],
  ],
  "quick-access": [
    [
      "获取 API Key",
      "凭证的计费类型与模型访问权限必须匹配；创建流程见“获取 API Key”。本项目的账号与发放能力尚未配置，服务状态见 /service-status。",
    ],
    [
      "配置接入端点",
      "将 __API_BASE_URL__ 替换为实际配置的基础地址。该占位符不是可请求的生产域名。",
    ],
    [
      "发起第一个",
      "下面分别保留 Python、JavaScript 和 cURL 请求结构；运行前从服务端环境读取 VELINK_API_KEY。",
    ],
    [
      "响应格式",
      "以实际 HTTP 状态和 JSON 内容判断请求结果。示例响应只展示字段结构。",
    ],
  ],
  billing: [
    [
      "Token 计费",
      "K = 1,000 Token；M = 1,000,000 Token。文本、视觉、向量及重排服务可能分别核算输入、输出或缓存用量。",
    ],
    [
      "阶梯计费",
      "阶梯由单次输入量确定，命中后整次请求的各计量项采用该档价格。例如 100K 输入落入 32K < 输入 ≤ 128K 档，而非分段累进计价。",
    ],
    [
      "缓存价格",
      "写入、命中与未命中输入可能分开报价。某项未出现在价格表时，不能推断平台已配置该计量项。",
    ],
    [
      "非 Token",
      "图像、视频、音频也可能按张、秒、字符或组合计量；以 Usage、日志和账单的实际记录核算。",
    ],
    [
      "文本生成",
      "本组单价单位为元/百万 Token，输入与输出分别计算；缓存列仅在模型适用时列出。",
    ],
    ["向量与", "本组按输入 Token 核算，价格单位为元/百万 Token。"],
    ["重排序", "本组按输入 Token 核算，价格单位为元/百万 Token。"],
    [
      "图像生成",
      "计量可能依据输入图数或输出图数；分辨率、像素范围与任务类型会改变单价。",
    ],
    [
      "视频生成",
      "分辨率、素材类型和生成方式是计价条件，不是累计用量阶梯。视频服务可能组合使用时长、输出 Token、输入图片或上下文 Token。",
    ],
    [
      "HappyHorse",
      "文生、首帧生与参考生视频按成功输出的秒数收费；编辑任务计入输入与输出时长之和，再乘对应分辨率的每秒单价。",
    ],
    [
      "费用估算",
      "先确认模型与阶梯，再分别计算各计量项并相加。估算不能替代结算账单。",
    ],
    [
      "账单与",
      "Usage、调用日志、聚合用量和最终账单可能不同步。本页原文另称按量费用通常次日更新；“账单查询与出账说明”记载 30 分钟内出账，应向参考平台核实实际口径。",
    ],
  ],
  "billing-guide": [
    [
      "账单结构",
      "月度汇总用于看账期累计，分钟明细用于定位消费。分钟是记录粒度，并不表示每次请求独占一条账单或实时出账。",
    ],
    [
      "出账时间",
      "原平台规定调用后 30 分钟内出账，因此刚发生的消费可能暂未进入汇总与明细。",
    ],
    [
      "月结差额",
      "系统金额精度为小数点后 8 位，月中未体现的第 3–8 位在月结汇总补差。2026 年 10 月的差额于 11 月 1 日产出，但归入 10 月 31 日的原账期明细；这不是新增调用或额外收费。",
    ],
    [
      "查看月度",
      "在费用中心按账期查询消费明细，产品选择 DTMaaS 按量付费、付费方式选择后付费，再核对实例金额与支付状态。",
    ],
    [
      "查看分钟",
      "从消费记录进入详情，按消费时间展开各计量项，并核对模型、供应商与价格阶梯；取消隐藏零元明细可检查零金额记录。",
    ],
    [
      "核对计费",
      "输入、输出、缓存命中和创建的单价可能不同，应逐项核对用量与金额。",
    ],
    [
      "核对月度",
      "月中排除最近 30 分钟的延迟影响；月结后回看原账期末日补差，再与月度合计核对。",
    ],
    ["导出消费", "先选账期、产品与付费方式，再在消费明细页面导出。"],
    ["导出分钟", "进入单条消费详情，在详情明细区域导出。"],
    [
      "为什么调用",
      "先等待原平台规定的 30 分钟出账窗口，再查询对应账期与消费时间。",
    ],
    ["分钟级账单", "记录按分钟归集，但仍可能延迟出账。"],
    [
      "为什么停止",
      "核对消费时间而非出现时间：新显示的账单可能对应停止前的请求。",
    ],
    [
      "为什么月结",
      "月中延迟与小数精度补差都可能造成差异；完整月结记录是对账依据。",
    ],
    ["为什么次月", "次月 1 日是差额产出时间，费用归属仍是上月。"],
    [
      "为什么一条",
      "同一分钟可能同时存在输入、输出与缓存等计量项，需展开核对。",
    ],
  ],
  "console/api-key": [
    [
      "Token Plan",
      "参考平台购买 Agent 套餐后会生成对应的套餐 API Key，使用该凭证才会进入套餐计量路径。",
    ],
    [
      "按量付费",
      "按量调用需要先充值并开通服务，且余额可用。首次开通后生成的默认 Key 不能删除，可另建应用凭证。",
    ],
    ["首次开通", "首次创建时若出现开通提示，应先完成参考平台的按量服务开通。"],
    [
      "管理 API",
      "管理权限随所属空间决定。可复制、改名、启停、重置或删除；重置会让旧密钥立即失效。",
    ],
  ],
  "console/model-marketplace": [
    [
      "前提条件",
      "参考平台需具备 Agent 套餐或按量付费服务。Velink 的购买与账户功能状态见 /service-status。",
    ],
    [
      "操作步骤",
      "按输入模态、输出模态、上下文长度及厂商缩小范围，再进入详情核对调用模型 Code。",
    ],
    ["模型对比", "参考平台最多可同时比较 3 个模型的参数。"],
  ],
  "console/account-management": [
    ["账号用量", "用量页面用于查看账号下的调用与模型消耗。"],
    ["账号成本", "成本入口展示按量账单，核账规则见账单说明。"],
    ["账号订单", "参考平台订单入口跳转 SOFAStack 订单管理，查询交易详情。"],
    ["提交工单", "工单入口跳转 SOFAStack 的查询或提交页面。"],
    ["账号设置", "账号设置跳转 SOFAStack 账号信息。"],
    ["头像菜单", "头像菜单提供相关账号服务的快捷访问。"],
  ],
  "console/space-management": [
    [
      "业务场景",
      "空间用于分清统计口径、权限与预算责任；人员不同本身并非拆分理由。",
    ],
    [
      "周期总量",
      "先看最近 7–30 天的日均、峰值与成本。已有业务参考历史高位并留增长量；新业务先设保守额度，运行 3–7 天后复查。Token 总量需要结合模型单价才能换算金额预算。",
    ],
    [
      "新建空间",
      "在空间列表创建并保存名称、描述，系统分配固定 ID 和创建时间；随后设置模型权限、周期额度并创建 Key。可采用业务名称加环境的命名方法。",
    ],
    [
      "编辑空间",
      "可修改名称、环境或描述，空间 ID 与既有 Key 的归属不会随改名变化。",
    ],
    [
      "默认空间",
      "原平台默认空间所有模型开启且无总量上限，配置只读；要关闭模型或设额度，应新建空间。",
    ],
    [
      "添加和管理",
      "在空间成员页按姓名检索并管理成员；入口及动作取决于权限，租户主账号或获授权的空间超级管理员可操作。",
    ],
    [
      "配置空间",
      "先保存空间总 Token / Credits 额度，再保存各模型权限与周期 Token 额度。留空代表无限制。日、周、月均按自然周期重置，周为周一，月为 1 日。单模型权限与 Token 上限只约束按量调用，Agent 套餐用空间 Credits 限流。",
    ],
    [
      "创建 API",
      "从空间内创建会带入归属，统一入口则需手动选择。区分 Pay as you go 与 Token Plan，填写业务名称并立即保存完整密钥；关闭弹窗后不能再次查看全文。",
    ],
    [
      "查看、停用",
      "停用会立即阻止新调用但保留总量配置，重新启用恢复；改名不改变密钥、类型或归属。删除不可恢复，会使相关调用失败。额度配置在空间和模型两层，控制累计消耗而非并发。",
    ],
    [
      "查用量",
      "用空间与时间先看概览，再按厂商、模型和 Key 定位。计量项显示“—”表示不适用，显示“0”才是适用但无消耗。",
    ],
    [
      "查成本",
      "成本在费用中心核查，失败请求则在调用日志联动筛选空间、模型与 Key。",
    ],
    [
      "权限速查",
      "原平台租户主账号可以给子账号授予 MaaS-空间超级管理员角色，保存后需重新登录；具体权限边界见下表。",
    ],
  ],
  "model-fallback": [
    [
      "工作原理",
      "先重试当前模型的可用渠道，耗尽且符合回退规则后才进入下一备用模型。例如 qwen3.7-plus → ling-3.1-flash → deepseek-flash；任一步成功即结束。",
    ],
    [
      "请求参数",
      "model 必填，models 位于请求体顶层且必须为非空字符串构成的数组，不能为 null、字符串或对象。models: [] 表示不配置备用项。列表既不自动排序也不去重。原平台不设独立数量上限，但总重试和超时可能使列表无法全部尝试，建议仅列 1–3 个兼容模型。",
    ],
    [
      "调用示例",
      "示例使用 Chat Completions；每个候选都必须具备当前 Key 权限，并接受原请求的输入、工具和参数。",
    ],
    ["cURL", "加上 --include 可观察响应 Header。"],
    [
      "Python SDK",
      "OpenAI Python SDK 的 models 扩展放入 extra_body。切换后复用同一消息、工具及输出长度，不能为备用模型分别定义参数。",
    ],
    [
      "切换条件",
      "只有实际调用上游失败、当前渠道尝试耗尽、仍有备用项，且请求尚未超时、取消、耗尽总重试或提交响应时，才可能继续。单看 HTTP 429、500 或 509 无法确认是否切换。",
      "上游调用前的选路错误、模型不存在、权限/余额/限流/安全拒绝、非法参数、强制渠道或禁止回退的路由不会被 models 自动绕过。备用项按轮到时校验，某项权限或路由校验失败就结束，不会跳过它继续后续候选。",
    ],
    [
      "确认实际",
      "x-dtrouter-fallback-model 记录最后尝试的备用模型，成功失败都可能返回；首选模型或同模型换渠道时不返回，模型不可识别等异常也可能缺失。Header 不能代替 HTTP 与业务结果检查，Body 格式保持原协议。",
    ],
    [
      "流式请求",
      "stream: true 使用相同备用列表。仅能在 Header 与首段流数据提交之前切换；开始输出后发生错误，不能再切换或拼接另一模型的结果。",
    ],
    [
      "计费与性能",
      "实际模型不同会影响价格，多次渠道与模型尝试也会增加时延和限流占用。客户端超时应容纳必要的备用尝试，最终费用以原平台账单为准。",
    ],
    [
      "使用限制",
      "适用于已支持该能力的 JSON 请求与 Gemini URL 模型协议；Gemini 首选项在 URL，models 仍在 JSON 顶层。multipart/form-data、二进制上传、已建立 WebSocket 不适用，也不能与 AutoModel 同用。终止错误按实际原因返回，未统一成固定状态码。",
    ],
    [
      "配置建议",
      "检查上下文、模态、工具与结构化输出兼容性；按时延和价格排序备用项。上线前模拟首选故障并记录回退 Header，核对响应质量和超时。",
    ],
  ],
  "choose-provider": [
    [
      "Provider 标识",
      "从目标模型详情的供应商区域复制英文标识，不能用展示名或其他模型的标识替代。",
    ],
    [
      "选择调用方式",
      "only 限定允许范围，order 决定优先级，二者含义不同；只列 A、B 且模型恰好只有 A、B 时，only 不会产生 A 优先的效果。供应商新增后 only 仍只允许原列表。",
    ],
    [
      "请求示例",
      "provider 与 model、messages 同级放在 Body，不需专门 Header。order 可在首选无候选时继续其他合法供应商，only 则始终限制在指定集合。",
    ],
    [
      "注意事项",
      "数组项必须是非空字符串；only: [] 会禁止全部候选，并非取消限制。固定供应商仍可能按平台规则重试，但每次重试都受 only 范围约束。",
    ],
  ],
  "get-model-list": [
    [
      "OpenAI 兼容接口",
      "该格式一次返回当前 Key 可访问的全部模型，暂不分页；limit、after_id、before_id 不适用。",
    ],
    [
      "Anthropic 兼容接口",
      "该格式支持游标分页，能返回展示名称、发布时间与输入输出 Token 上限。",
    ],
    ["接口说明", "接口使用 GET 且无请求体；具体路径、认证和参数见下表。"],
    [
      "请求头",
      "推荐把认证放入 Authorization。与查询凭证同时给出时，非空 Authorization 优先。",
    ],
    [
      "查询参数",
      "withPrice=true 才请求价格信息。Anthropic 的 after_id 适合顺序遍历，before_id 结果不保证是紧邻游标的上一页；不要同时给两个方向。",
    ],
    [
      "请求示例",
      "代码从 VELINK_API_KEY 环境变量取凭证，基础地址需先替换配置。",
    ],
    [
      "获取下一页",
      "has_more 为 true 时，用本页 last_id 作为下一请求 after_id，直至 has_more 为 false。示例 limit=10 只展示用法，并非默认或最大条数。",
    ],
    [
      "响应参数",
      "成功响应为 HTTP 200 与 JSON 对象，字段结构见相应协议的下表。",
    ],
    [
      "顶层字段",
      "OpenAI 格式的 first_id、last_id、has_more 以及 priceInfo 是原平台扩展；其中首尾 ID 不代表该接口支持分页。",
    ],
    ["模型字段", "保留协议原始字段名；客户端不要把显示名称当作可调用模型 ID。"],
    ["定价字段", "priceInfo 描述计量项与阶梯条件，具体字段定义见表。"],
    [
      "响应示例",
      "模型 ID、时间、价格与 Token 上限均是原文的结构示例，不能据此判断实际服务范围或报价。",
    ],
    [
      "空列表",
      "空列表可能表示 Key 无可返回模型；Anthropic 还可能是游标不在可访问范围或该方向无数据。",
    ],
    [
      "定价信息",
      "只有存在阶梯定价的模型才会在 withPrice=true 时包含 priceInfo，示例只展示主要字段。",
    ],
    ["包含定价", "withPrice=true 不保证每个模型都有 priceInfo。"],
    [
      "错误响应",
      "OpenAI 格式以 error 对象描述失败；Anthropic 格式还带顶层 type。结合状态码、错误类型与信息排查。",
    ],
    ["错误示例", "错误片段用于对照字段；请求状态和业务错误需一并检查。"],
  ],
  "platform-api/query-api-usage": [
    [
      "前提条件",
      "创建并授权服务账号，获取配套 AK/SK；目标参数须是 token-xxx 形式的 tokenId，而非 API Key 明文。Java 运行环境须为 8 或以上，密钥留在服务端。",
    ],
    [
      "引入 Java",
      "在 pom.xml 加入原文 SDK 依赖；这是参考平台专用 SDK，不能据此视为已配置 Velink OpenAPI。",
    ],
    [
      "准备调用",
      "AK/SK 标识并认证服务账号，tokenId 选择查询对象，应分开管理配置。",
    ],
    [
      "调用示例",
      "替换 AK、SK、tokenId 与查询时段后运行。SDK 负责序列化、签名、req_msg_id 生成及响应解析，无需另填 sign、sign_type 或租户网关字段。",
    ],
    ["请求参数", "表中采用 Java 属性名，接口需要的参数名由 SDK 转换。"],
    [
      "查询时间",
      "时间必须带时区，起点早于终点；开始时间限最近 3 个月，单次跨度 ≤90 天。查询采用左闭右开区间，至少包含完整 5 分钟。",
      "未对齐时起点向后、终点向前取 5 分钟边界：10:02–10:18 实际为 10:05–10:15。当前 10:23 时终点最多取已结束边界 10:20；数据聚合还可能延迟。",
    ],
    [
      "分页与排序",
      "usages 只含当前页，total 是范围内模型记录总数。遍历时保持 Key、时间和排序不变，递增 pageNum，达到 total 或遇空页结束。非 Token 模型排在 Token 模型后，按调用次数降序。",
    ],
    [
      "响应字段",
      "queryApikeyUsage 返回 QueryApikeyUsageResponse，可直接读取 getter。非 Token 模型的 Token 空值表示不适用，不能当作 0；该接口不提供金额或 Credits 扣减。",
    ],
    [
      "常见问题",
      "接口失败可能抛出 TeaException，保留错误码、消息与可取得的 reqMsgId；连接与超时按应用异常策略处理。",
    ],
  ],
  "platform-api/get-ak-sk": [
    [
      "区别",
      "AK 标识服务账号，SK 用于本地签名；两者用于管理接口，API Key 则用于模型推理。",
    ],
    [
      "使用前",
      "确认企业/租户正确且当前账号有服务账号管理与授权权限。生产和测试分别建服务账号，可减少权限混用与轮换影响。",
    ],
    [
      "创建服务",
      "服务账号代表程序，不供自然人登录；这样可把应用审计与个人账号分开。",
    ],
    [
      "为服务账号",
      "只有身份凭证还不够，必须授予目标 OpenAPI 权限。查询程序只申请只读权限；租户、空间和角色共同约束数据范围，无法借 OpenAPI 绕过。角色名称以原平台管理台为准，未显示时由管理员处理。",
    ],
    [
      "获取 AK",
      "若 SK 只展示一次，应在关闭页面前存入密钥系统。无法再次查看时重新生成或轮换，不从日志、历史代码中找回。",
    ],
    [
      "应用中使用",
      "在受控服务端本地计算签名，SK 不写入请求体、URL、日志或客户端。签名格式取决于对应接口协议。",
    ],
    [
      "验证配置",
      "先调用只读用量接口，检查同一账号的 AK/SK、角色、时间、签名、请求头及数据范围，再进入正式应用。",
    ],
    [
      "安全管理",
      "按应用与环境隔离账号，使用最小权限和密钥变量；日志避免完整凭证及签名原文。新凭证验证后停用旧凭证，泄露时立即撤销并更新应用。",
    ],
    ["看不到", "缺少管理或授权入口时，请租户管理员检查当前账号角色。"],
    ["没有权限", "认证成功不等于授权成功，应核对服务账号角色及租户/空间。"],
    ["能否互换", "管理 OpenAPI 的 AK/SK 与推理 API Key 分属不同认证机制。"],
    ["SK 泄露", "撤销已泄露 AccessKey，创建替代凭证，部署更新后验证调用。"],
    ["下一步", "继续用“查询模型用量”的接口参数与代码验证配置。"],
  ],
  "lingdt-decision-api-guide": [
    [
      "基本介绍",
      "支持 choice（单选）、noul（判断）、score（评分）、multi-choice（多选）及 DAG；extract 仅见于 lingdt-decision-1.0。原文称置信度已对齐，但并不代表任何业务的准确率保证。原平台提供按量与 Agent 套餐两种调用方式。",
    ],
    [
      "快速开始",
      "示例用退款工单选择负责部门。先备齐服务地址、已授权模型路由名与 API Key。",
    ],
    [
      "响应示例",
      "errorCode: 0 才表示业务成功；answers.department 与请求问题 ID 对应。示例 billing 概率为 0.9988，confidence 为 0.9984，二者表达不同概念。",
    ],
    [
      "请求字段",
      "问题 ID 仅允许英文、数字、下划线、连字符，长度 1–64。按 ID 取答案，不依赖 JSON 字段顺序。",
    ],
    [
      "state 放",
      "state 提供共享事实，instructions 定义判断目标，criteria 约束判定标准。对话数组仍是一份材料，并非自动拆成多个样本；独立材料应分请求。字段与选项命名要符合实际语义。",
    ],
    [
      "先选问题",
      "choice / multi-choice 的选项说明可为字符串、对象、数组或 null。null 依靠选项名表达，开始接入时宜使用清晰的文字描述。",
    ],
    [
      "完整请求",
      "五任务示例仅适用于 lingdt-decision-1.0；1.1 的 4B/27B 版本须删除 overcharge_amount 抽取任务。前四项共享 state，抽取读取本项 context；各问题彼此独立，不读取其他答案。",
    ],
    [
      "信息抽取",
      "1.0 的 extract 在 criteria 中定义 1–96 个槽位，在问题 context 给出原文，max_spans 可限制条数。示例“199元”对应 start:15、end:19；应用应校验片段与位置。",
    ],
    [
      "成功条件",
      "依次检查网络、HTTP、JSON、errorCode == 0、答案完整性及类型/取值；任何环节失败都进入异常或业务兜底。",
    ],
    [
      "结果处理",
      "noul 应在 [0,1]，score 在 [0,等级数−1]；多选结果只能含已声明选项。extract 需验证 spans、实体类型、位置并记录 model_span_count 与 truncated。请求失败不能伪装成 false、0 或空标签。",
    ],
    [
      "confidence",
      "confidence 是分布确定程度，0.9 不等于业务正确率 90%。用标注样本测量自动处理覆盖率与错误率，按动作风险设门槛；模型、文案、选项或量表变更后重新验证。",
    ],
    [
      "按序决策",
      "当下游语义判断依赖前项结果时使用 options.dag，且服务入口需开通 DAG。",
    ],
    [
      "什么时候",
      "独立判断可用普通多问题请求；概率阈值等精确规则可在业务代码执行，无需 DAG。",
    ],
    [
      "DAG 请求",
      "edges 的 key 为下游问题，depends 列上游 ID；所有 ID 必须在 questions 存在。未列入 edges 的问题无依赖，调度按图执行而非 JSON 顺序。",
    ],
    [
      "输出与验收",
      "answers 保留各问题答案，顶层 layers 列出执行层。验收需同时核对依赖关系、分层和结果。",
    ],
    [
      "同时检查",
      "原文基础接口中，无 Key 为 HTTP 401，非法 JSON 为 400，参数校验失败却可能为 HTTP 200 + errorCode:1。一个问题非法会拒绝整单，合法问题也不会产生可用 answers。",
    ],
    [
      "DAG 错误",
      "计划阶段错误在模型调用前拒绝；执行阶段错误会中止后续层，具体约定见表。",
    ],
    [
      "使用限制",
      "下表保留各版本上下文、DAG 深度、抽取能力及请求限制。不要根据 1.0 的示例推断 1.1 同样支持 extract。",
    ],
  ],
  "agent-guides/codex": [
    [
      "示例模型",
      "原文以 deepseek-v4-flash 演示，另有下线公告将其请求路由至 deepseek-flash。配置示例不是可用性保证；接入前需核对模型列表与 Responses 兼容性。",
    ],
    [
      "准备工作",
      "需要可运行 Codex CLI 的系统、有效凭证及模型权限。账号发放与服务接入状态见 /service-status。",
    ],
    [
      "安装 Codex",
      "可使用原文的官方安装脚本或 npm 命令。已安装者先检查版本；Windows 按官方平台安装方式选择。",
    ],
    [
      "获取 MaaS",
      "示例将原平台凭证名称适配为 VELINK_API_KEY。真实凭证只在服务端或本地密钥环境保存。",
    ],
    [
      "配置 API",
      "为当前终端配置 VELINK_API_KEY；Unix 可加入 shell 配置并 source 重新加载，PowerShell 方式见代码。",
    ],
    [
      "配置 Codex",
      "config.toml 是用户配置；models.json 声明模型元数据，不放 API Key。先保留已有权限、MCP 与其他设置，再合并必要项。",
    ],
    [
      "创建模型目录",
      "模型目录顶层为 models 数组，slug 不可重复；已有文件先备份，再合并模型对象。字段要求可能随 CLI 版本变化。",
    ],
    [
      "config.toml 中",
      "model、model_provider、model_catalog_json 写在所有 TOML 配置段之前。目录路径必须换成真实可读的绝对路径，不能保留 your-user 占位。",
    ],
    [
      "启动并验证",
      "完全退出旧会话，新终端在项目中启动。/status 检查实际模型、Provider 与基础地址；/model 只能证明目录加载，还需发送简单请求验证完整链路。",
    ],
    [
      "配置项说明",
      "model_provider 必须与 model_providers 下的键完全一致；模型目录 slug 也必须等于 model。base_url 只写基础路径，不追加 /responses。",
    ],
    [
      "更换模型",
      "先确认目标支持 Responses，再同步修改 config.toml 的 model 与目录 slug/display_name，按真实模型能力调整元数据，重启后检查 /status。",
    ],
    [
      "常见问题",
      "先验证环境变量存在、Key 权限和余额，再检查 Responses 支持、模型 ID 与覆盖配置。env_key 只写变量名 VELINK_API_KEY，不写真实密钥或带 $ 的表达式。",
      "配置不生效时核对 ~/.codex/config.toml、命令行覆盖、Provider 大小写与 TOML 表位置；模型目录必须为合法 JSON、有 models 数组且路径可读，必要时按 codex --version 匹配目录字段。",
    ],
  ],
  "agent-guides/opencode": [
    [
      "示例模型",
      "原文采用 lingdt-3.0-flash；当前实际可调用范围需按所配置服务的模型列表核对。",
    ],
    [
      "准备工作",
      "需要可运行 OpenCode 的终端、有效凭证与对应模型权限。账号和套餐状态见 /service-status。",
    ],
    [
      "安装 OpenCode",
      "可使用原文的官方安装脚本或 npm 命令；安装后先查询版本。",
    ],
    [
      "获取 MaaS",
      "凭证适配为 VELINK_API_KEY 环境变量，不把真实密钥提交到配置仓库。",
    ],
    [
      "配置 OpenCode",
      "全局文件位于 ~/.config/opencode/opencode.json。保留已有 Provider、工具与权限，合并新条目，并用环境变量引用提供认证。",
    ],
    [
      "启动并验证",
      "重启后用 /models 确认 Provider 和模型，再发送简单请求验证端到端通信。模型出现在列表中不等于已完成调用。",
    ],
    [
      "配置项说明",
      "$schema 用于配置校验；实际请求地址与认证由 options.baseURL、options.apiKey 决定。",
    ],
    [
      "更换模型",
      "同时修改 Provider 的 models 条目和最外层 model，后者采用 providerId/modelId。保留 $schema、npm、name、options，重启并用 /models 确认。",
    ],
    [
      "常见问题",
      "核对 Key、权限、额度、模型完整 ID 与 Provider ID，再检查配置路径和 JSON 标点。项目根 opencode.json 或 OPENCODE_CONFIG 可能覆盖全局文件。",
      "JSON 不允许注释和尾随逗号，可用下方命令解析验证；重新启动后再确认实际选中模型。",
    ],
  ],
  "token-plan": [
    [
      "套餐详情",
      "下表是参考平台旧版订阅规格。额度按真实模型调用次数扣除，并非用户提问数；工具使用、上下文和任务难度都可能改变实际次数。",
      "5 小时额度按对应 5 小时周期恢复；周额度在周一 00:00:00（UTC+08:00）重置；月额度在下月订阅日 00:00:00（UTC+08:00）重置。",
    ],
    [
      "购买套餐",
      "原文在套餐页选择档位并完成购买。Velink 未配置交易入口，相关状态见 /service-status。",
    ],
    [
      "其他操作",
      "参考平台支持查看可用模型与 5 小时用量、升级档位，以及临近到期或到期后 24 小时内续费。",
    ],
    [
      "常见问题",
      "原平台每账号同时只订阅一个 Token Plan，不区分档位；购买后不退订、不退款。仅套餐列表内模型适用相应规则。",
      "使用通用 sk-xxxxx 按量凭证不能抵扣套餐额度。套餐外模型，或部分档位周期/周/月额度已尽时，若已开通按量服务仍可能产生额外按量账单，必须核对实际凭证和费用。",
    ],
  ],
  "token-plan-agent": [
    [
      "适用场景",
      "原文把 AI 编程、Agent、多模态内容生产列为套餐使用场景，具体选择依据业务调用规模。",
    ],
    [
      "产品能力",
      "原平台支持跨模型 Credits 核算、工具接入、多档包月及团队额度分配/回收。其“对话数据不用于训练”描述只属于原平台，处理边界以其生效服务协议为准。",
    ],
    [
      "支持模型",
      "表格保留参考平台列出的模型 Code 与分类。Ling 排列在前只是查找顺序，不能理解为性能排名；真实范围以原平台可用模型页为准。",
    ],
    [
      "Credits 计量",
      "消耗受模型、输入/输出、思考模式、工具与多模态规格影响，账单是扣减依据。",
    ],
    [
      "消耗倍率",
      "以 qwen3.7-plus = 1x 比较典型同类任务：若基准任务消耗 10 Credits，2x 约为 20，0.2x 约为 2；这是量级参考，不能视为固定报价。",
      "原文把 0.2x–0.6x 用于预算敏感/高并发任务，1x 用于日常任务，2x–3x 用于强推理或长程代码，4x 以上用于复杂任务。",
    ],
    [
      "文本模型计量",
      "下表以 qwen3.6-plus 展示输入、缓存、输出的 Credits 换算；不同模型规则不同，不能只看总 Token 数比较。",
    ],
    [
      "视频模型计量",
      "happyhorse-1.0-i2v 示例受模型、分辨率、时长与生成方式影响。",
    ],
    [
      "图像模型计量",
      "下表用 qwen-image-2.0 说明计量条件；它不是跨模型通用规则。",
    ],
    [
      "新购套餐",
      "原平台新购后检查 Credits、有效期和状态，再用 Agent 类型 API Key 调用套餐内模型。Velink 交易功能尚未配置，见 /service-status。",
    ],
    [
      "加购套餐",
      "加购额度与现存额度可叠加，但新套餐有独立生命周期。扣减顺序与过期状态应逐套餐核查，不能只看汇总额度。",
    ],
    [
      "团队额度",
      "管理员可按成员或业务单元分配与回收，调整前先看近期消耗，避免额度不足中断调用或长期闲置。",
    ],
    [
      "使用注意",
      "Key 类型与模型 Code 必须匹配；Credits 示例不是长期价格承诺。周期复核成员、业务和模型消耗，并分别检查各加购包有效期。",
    ],
  ],
  "about/caict-evaluation": [
    [
      "蚂蚁数科",
      "公告描述六个评估方向：模型服务、Token 性能、可信性、运维、体验、计量计费。通过评估的主体为 DTMaaS。",
    ],
  ],
  "about/lingdt-decision-release": [
    [
      "专为决策",
      "决策模型把意图、风险、路由等任务约束为候选判断，减少生成结构化文本后的解析工作。原平台在客服、风控和金融场景进行比较。",
      "原文报告：标注任务相对 DS-V4-flash 约降低 97% Token 成本、提速约 10 倍；客服相对 Qwen-3.7-flash 成本约降 90%、时效约增 1 倍，风险准确率 76%→89%。金融任务相对 Qwen-8B 等模型时效约增 5 倍，工具组合完全匹配率约为 2.6 倍，幻觉召回率 44%→70%。这些数据依赖原实验场景。",
    ],
    [
      "两大功能",
      "多选能同时识别退款、续费、发票等并行诉求；DAG 则把需先核验的动作与后续判定连接起来。",
      "发布材料以 23 项基准比较模型，综合指数 = 0.9×单选 + 0.1×多选；其中单选 13 项、多选 10 项。原文的领先结论只适用于其所述评测口径。",
    ],
  ],
};
const updateRules = {
  "ling-3-0-flash-fin-free-ending": {
    model: "ling-3.0-flash-fin",
    price: "公告折扣为原价的 5.6 折。",
  },
  "ling-3-0-flash-sante-free-ending": {
    model: "ling-3.0-flash-sante",
    price: "公告折扣为原价的 5.6 折。",
  },
  "ling-3-0-flash-vl-free-period-ending": {
    model: "ling-3.0-flash-vl",
    price: "公告折扣为原价的 2.8 折；不希望计费的应用需在生效前停止调用。",
  },
  "ling-3-1-flash-free-ending": {
    model: "ling-3.1-flash",
    price:
      "公告优惠价为原价的 25%，即减免 75%。输入、输出与缓存命中按各自用量计算。",
  },
  "ling-3-2-flash-free-ending": {
    model: "ling-3.2-flash",
    price: "公告规定免费期后按原价收费，未列额外折扣。",
  },
  "ming-image-design-free-ending": {
    model: "ming-image-0.1-design / ming-image-0.1-design-layer",
    price:
      "公告优惠为原价 40%（4 折）。每百万 Token 约生成 250 张 1K 图仅是估算：原价约 0.05 元/张，优惠约 0.02 元/张；真正收费单位仍是 Token，不按张结算。",
  },
  "atria-dawn-free-ending": {
    model: "atria-dawn / atria-dawn-preview",
    price:
      "旧 ID atria-dawn-preview 路由到 atria-dawn，二者统一按新服务收费。公告限时价为原价的 1%（0.1 折，即优惠 99%），从开始计费至 2026 年 12 月 9 日；实际活动可调整。",
  },
};
function adapt(s, code = false, language = "") {
  s = s.replace(/http:\/\/<MAAS_GATEWAY>/g, "__API_BASE_URL__");
  s = s
    .replace(
      /https:\/\/(?:maas-api|maas-coding|maas-agent|api-maas)\.antdigital\.com/gi,
      "__API_BASE_URL__",
    )
    .replace(
      /https:\/\/[^\s"'`<>]*maas[^\s"'`<>]*\.ant(?:digital|group)\.com(?=\/v1)/gi,
      "__API_BASE_URL__",
    );
  s = s.replace(
    /MAAS_API_KEY|YOUR_MAAS_API_KEY|YOUR_API_KEY|DTMAAS_API_KEY/g,
    "VELINK_API_KEY",
  );
  if (code) {
    s = s.replace(
      /'Authorization: Bearer <API_KEY>'/g,
      '"Authorization: Bearer $VELINK_API_KEY"',
    );
    s = s.replace(
      /VELINK_API_KEY="VELINK_API_KEY"/g,
      'VELINK_API_KEY="<your-api-key>"',
    );
    s = s
      .replace(/model_providers\.maas/g, "model_providers.velink")
      .replace(/model_provider\s*=\s*"maas"/g, 'model_provider = "velink"')
      .replace(/"maas"\s*:/g, '"velink":')
      .replace(/maas\//g, "velink/")
      .replace(/\(MaaS\)/g, "(Velink)")
      .replace(/name = "MaaS"/g, 'name = "Velink"')
      .replace(/"name":\s*"MaaS"/g, '"name": "Velink"');
    if (language === "json")
      s = s.replace(
        /"apiKey":\s*"VELINK_API_KEY"/g,
        '"apiKey": "{env:VELINK_API_KEY}"',
      );
    if (/python/i.test(language)) {
      s = s
        .replace(
          /api_key\s*=\s*"VELINK_API_KEY"/g,
          'api_key = os.environ["VELINK_API_KEY"]',
        )
        .replace(
          /"Authorization":\s*"Bearer VELINK_API_KEY"/g,
          '"Authorization": f"Bearer {os.environ[\'VELINK_API_KEY\']}"',
        );
      if (s.includes("os.environ") && !/import os/.test(s))
        s = "import os\n" + s;
    }
    if (/javascript|typescript|node/i.test(language)) {
      s = s.replace(
        /"Authorization":\s*"Bearer VELINK_API_KEY"/g,
        '"Authorization": `Bearer ${process.env.VELINK_API_KEY}`',
      );
    }
    if (/bash|shell|sh/i.test(language))
      s = s
        .replace(/Bearer VELINK_API_KEY/g, "Bearer $VELINK_API_KEY")
        .replace(
          /'Authorization: Bearer <VELINK_API_KEY>'/g,
          '"Authorization: Bearer $VELINK_API_KEY"',
        );
  }
  return s;
}
const result = [];
for (const doc of docs) {
  const sections = [];
  let sec;
  function section(b) {
    sec = {
      id: b.id || "overview",
      title: b.level === 1 ? "概览" : b.text,
      level: b.level || 1,
      paragraphs: [],
      tables: [],
      codeExamples: [],
    };
    sections.push(sec);
  }
  for (const b of doc.blocks) {
    if (b.kind === "heading") {
      section(b);
      continue;
    }
    if (!sec) section({ text: "概览", level: 1 });
    if (b.kind === "table" && b.rows.length) {
      sec.tables.push({
        headers: b.rows[0].map((x) => adapt(x)),
        rows: b.rows.slice(1).map((r) => r.map((x) => adapt(x))),
        sourceUrl: doc.sourceUrl,
      });
    }
    if (b.kind === "code" && b.text)
      sec.codeExamples.push({
        language: b.language || "text",
        code: adapt(b.text, true, b.language),
      });
  }
  if (!sections.length) section({ text: "概览", level: 1 });
  sections[0].paragraphs.push(
    intro[doc.slug] ||
      "本页记录参考平台公开公告中的模型服务变更。涉及时间、价格与迁移安排的主体均为 DTMaaS。",
  );
  for (const sec of sections) {
    const sourceHeading =
      sec.level === 1
        ? doc.blocks.find((b) => b.kind === "heading")?.text
        : sec.title;
    for (const [match, ...paragraphs] of rules[doc.slug] || [])
      if (sourceHeading?.includes(match))
        sec.paragraphs.push(...paragraphs.map((x) => adapt(x)));
  }
  if (doc.slug.startsWith("updates/")) {
    const key = doc.slug.split("/")[1],
      r = updateRules[key];
    const text = doc.blocks
      .filter((b) => b.kind === "paragraph")
      .map((b) => b.text)
      .join("\n");
    const dates = [
      ...text.matchAll(/(?:发布时间|生效时间|影响时间|变更时间)[：:]([^\n]+)/g),
    ].map((x) => x[0]);
    sections[0].paragraphs.push(...dates);
    if (r) {
      const s = sections.find((s) => s.title === "变更内容");
      s?.paragraphs.push(
        `参考平台对 ${r.model} 结束免费调用，生效前的请求按免费期政策处理，生效后的请求依据实际用量结算。`,
      );
      const p = sections.find((s) => /价格/.test(s.title));
      p?.paragraphs.push(
        "下表金额单位为人民币元/百万 Token；价格和活动期限须按参考平台当期说明核对。",
        r.price,
      );
      if (/fin|sante|vl/.test(key))
        p?.paragraphs.push("缓存命中价仅适用于满足缓存计费条件的用量。");
      sections
        .find((s) => s.title === "变更影响")
        ?.paragraphs.push(
          "继续调用会进入按量结算，需重新估算预算并检查余额。此处为参考平台公告记录，不构成 Velink 的优惠或收费承诺。",
        );
    }
    if (key === "atria-dawn-migration") {
      sections
        .find((s) => s.title === "变更内容")
        ?.paragraphs.push(
          "原平台在公告时点移除模型名称与 ID 的 preview 标记，具体映射见表。",
        );
      sections
        .find((s) => s.title === "变更影响")
        ?.paragraphs.push(
          "把 model 从 atria-dawn-preview 改成 atria-dawn，并在迁移前验证配置及业务结果；协议和能力以新模型详情为准。",
        );
    }
    if (key === "deepseek-v4-flash-retirement") {
      sections
        .find((s) => s.title === "变更内容")
        ?.paragraphs.push(
          "上游调整后，原平台下线 DeepSeek-V4-Flash；旧 deepseek-v4-flash 请求过渡路由到 DeepSeek-V4.1-Flash（deepseek-flash）。",
        );
      sections
        .find((s) => s.title === "变更影响")
        ?.paragraphs.push(
          "新旧模型的效果、时延和计价不保证一致。自动路由只是过渡措施，最终费用按新服务规则。",
        );
      sections
        .find((s) => s.title === "迁移建议")
        ?.paragraphs.push(
          "用 deepseek-flash 回归提示词、输出、时延及异常处理，显式更新所有模型配置并核对新价；上线后检查日志，避免长期依赖旧 ID 自动路由。",
        );
    }
    if (key === "model-offline-260909") {
      sections
        .find((s) => s.title === "变更内容")
        ?.paragraphs.push(
          "参考平台因上游调整，于北京时间 2026 年 10 月 10 日 00:00 停止下表模型推理。",
        );
      sections
        .find((s) => s.title === "变更影响")
        ?.paragraphs.push(
          "名单中的旧模型 ID 将不能正常返回结果；原公告要求在 2026 年 10 月 10 日前完成替换与业务回归。",
        );
    }
    if (key === "lingdt-decision-1-1-upgrade") {
      sections[0].paragraphs.push(
        "1.1 新增付费 4B / 27B 服务，扩展上下文、DAG 深度、RPM 与并发。具体差异以表中版本规格为准。",
      );
      sections
        .find((s) => s.title.includes("付费版价格"))
        ?.paragraphs.push(
          "按输入 Token 计费，原公告活动为 5 折，单位为人民币元/百万输入 Tokens；当前价格以参考平台为准。",
        );
      sections
        .find((s) => s.title.includes("旧版本"))
        ?.paragraphs.push(
          "lingdt-decision-1.0-27b 须按公告期限迁移到新 ID 并验证；4B 的 lingdt-decision-1.0 可继续调用，需要更高规格时再选择 1.1 付费服务。",
        );
    }
  }
  for (const s of sections) {
    if (/相关文档/.test(s.title))
      s.paragraphs.push(
        "继续阅读：获取 API Key、模型市场与 Token Plan for Agent；工具安装和版本差异请查对应工具官方文档。",
      );
    if (doc.slug === "console/api-key" && s.title === "2.1 创建 API Key")
      s.paragraphs.push(
        "创建前确认按量付费服务已经开通，并选择正确空间；后续管理受该空间权限约束。",
      );
  }
  sections[0].paragraphs.push(
    "资料说明：本文依据参考平台公开文档整理。技术表格保留原字段与数值，每张表附原文地址；不代表 Velink 已提供对应模型、账户、交易或服务保障。",
  );
  result.push({
    slug: doc.slug,
    title: doc.title,
    group: doc.group,
    groupOrder: doc.groupOrder,
    order: doc.order,
    sourceUrl: doc.sourceUrl,
    sections,
  });
}
const groupOrders = {
  产品简介: 1,
  产品计费: 2,
  模型调用: 3,
  接入智能体: 4,
  控制台操作指南: 5,
  平台openAPI: 6,
  产品动态: 7,
  关于我们: 8,
};
for (const d of result) {
  if (d.group === "Token Plan") d.group = "产品计费";
  d.groupOrder = groupOrders[d.group] || d.groupOrder;
}
const orderedUpdates = [
  "ling-3-2-flash-free-ending",
  "atria-dawn-free-ending",
  "ming-image-design-free-ending",
  "lingdt-decision-1-1-upgrade",
  "atria-dawn-migration",
  "ling-3-1-flash-free-ending",
  "ling-3-0-flash-sante-free-ending",
  "ling-3-0-flash-fin-free-ending",
  "ling-3-0-flash-vl-free-period-ending",
  "deepseek-v4-flash-retirement",
  "model-offline-260909",
];
for (const d of result) {
  if (d.slug === "intro/scenarios") d.order = 3;
  if (d.slug === "intro/supported-models") d.order = 4;
  if (d.slug === "token-plan") d.order = 4;
  if (d.slug.startsWith("updates/"))
    d.order = orderedUpdates.indexOf(d.slug.split("/")[1]) + 1;
}
result.sort(
  (a, b) =>
    a.groupOrder - b.groupOrder ||
    a.order - b.order ||
    a.title.localeCompare(b.title, "zh"),
);
fs.writeFileSync(
  "src/content/docs.json",
  JSON.stringify(result, null, 2) + "\n",
);
console.log(
  JSON.stringify(
    {
      articles: result.length,
      sections: result.reduce((n, d) => n + d.sections.length, 0),
      tables: result.reduce(
        (n, d) => n + d.sections.reduce((m, s) => m + s.tables.length, 0),
        0,
      ),
      codeExamples: result.reduce(
        (n, d) => n + d.sections.reduce((m, s) => m + s.codeExamples.length, 0),
        0,
      ),
    },
    null,
    2,
  ),
);
