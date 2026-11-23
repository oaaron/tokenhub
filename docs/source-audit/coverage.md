# Velink 原站盘点与本地交付核对

核验日期：2026-11-22。唯一业务内容来源为 https://maas.antdigital.com/ 。使用既有 Velink 设计系统；不采用 ZenMux 的业务内容。

## 核实口径

- 浏览器已打开首页、模型市场、Token Plan、开发者文档，读取渲染内容和实际导航。
- 原站文档由 /docs 外壳嵌入 /dt-maas-docs；公开文章内容与目录通过官方构建资源补充核对。
- 原站已登录浏览器的模型视图显示 53 项；无需账户的公开目录接口返回 127 项。本站保留 127 条公开记录，127 个详情接口均成功。该数量不是 Velink 已开通模型数量。
- 原站当前套餐页显示 4 档月付，未发现年度切换。公共 Agent 套餐接口另有 1 档资格相关免费配置，保留在审计原始数据与文档，不冒充本站赠送活动。旧 Coding Plan 数据不是当前套餐页的在售档位。
- 原站内容中的计价、促销、认证、SLA、账号和管理 OpenAPI 具有原平台归属；本站未将这些内容改成 Velink 的已上线承诺。
- 文档正文独立整理，保留技术条件、例外与字段；原站插图采用实测比例的灰色占位图，没有复制截图或品牌素材。

## 覆盖数量

| 栏目 | 原站已核实 | 本地实现 |
|---|---:|---:|
| 首页信息区块（含全站公告与页脚） | 5 | 5 |
| 首页资讯入口 | 6 | 6 |
| 站点公告 | 5 | 5 |
| 模型动态卡片 | 4 | 4 |
| 公开模型 / 详情记录 | 127 / 127 | 127 / 127 |
| 当前套餐页月付档位 | 4 | 4 |
| FAQ 分类 / 问答 | 4 / 16 | 4 / 16 |
| 中文公开文档文章 | 35 | 34（按要求排除纯体验文章 1 篇） |
| 保留文章章节 / 技术表格 | 322 / 99 | 322 / 99 |
| 文档代码示例 | 66 | 66 |
| 来源相关链接 | 38 | 38（本地化产品、文档和服务路由） |
| 说明插图 | 45 | 45 个实测比例占位块 |
| 可展示模型代码示例 | 343 | 343 |
| 原站问题示例 | 9 | 9 条明确不可用说明，不提供猜测后的代码 |

## 原站页面 → 内容区块 → 交互入口 → 本地路由

| 原站 | 内容与顺序 | 入口处理 | 本地 |
|---|---|---|---|
| / | 公告 → 导航 → 首屏 → 厂商生态 → 资讯 → 页脚 | 移除首屏对话表单；主操作浏览模型，次操作快速接入 | / |
| /models | 输入模态、上下文、厂商；标题、价格类型、搜索、输出模态、模型动态、目录 | 保留非体验操作；查询参数保存筛选/分页/对比；12 条/页至末项 | /models |
| /models/compare | 最多 3 模型比较 | 静态技术规格比较；不提供聊天对比 | /models/compare?model=… |
| /models/:id | 介绍、模态、规格、供应商、阶梯计价、协议与参数、调用说明 | 复制模型 ID；按来源协议提供代码；跳转相关接入文档 | /models/:id?tab=intro 或 api |
| /pricing | 标题 → 模型上新 → 4 档月付 → 模型矩阵 → 优势 → FAQ → 页脚 | 选择状态保留在 URL；未配置购买时进入真实服务状态页 | /pricing?plan=Build&period=monthly |
| /docs | 文档导航、文章、页内目录、上/下篇 | 保留独立文章地址、多级分组、锚点、代码语言/复制和相关链接 | /docs/intro 及下列文章 |
| 账号、购买、客服、隐私与条款 | 项目尚无正式业务配置 | 不使用原站账户或交易接口，不模拟成功 | /service-status?service=… |
| 原站其他产品外链 | 不属于 Velink 已配置服务 | 不作为本站产品推荐；页脚保留本站有效入口 | 产品 / 文档 / 服务三组 |

## 文档路由明细

| 原站文章 | 本地路由 | 章节 |
|---|---|---:|
| https://maas.antdigital.com/dt-maas-docs/intro | /docs/intro | 3 |
| https://maas.antdigital.com/dt-maas-docs/intro/advantages | /docs/intro/advantages | 4 |
| https://maas.antdigital.com/dt-maas-docs/intro/scenarios | /docs/intro/scenarios | 7 |
| https://maas.antdigital.com/dt-maas-docs/intro/supported-models | /docs/intro/supported-models | 3 |
| https://maas.antdigital.com/dt-maas-docs/billing | /docs/billing | 36 |
| https://maas.antdigital.com/dt-maas-docs/billing-guide | /docs/billing-guide | 21 |
| https://maas.antdigital.com/dt-maas-docs/token-plan-agent | /docs/token-plan-agent | 19 |
| https://maas.antdigital.com/dt-maas-docs/token-plan | /docs/token-plan | 5 |
| https://maas.antdigital.com/dt-maas-docs/quick-access | /docs/quick-access | 5 |
| https://maas.antdigital.com/dt-maas-docs/choose-provider | /docs/choose-provider | 5 |
| https://maas.antdigital.com/dt-maas-docs/get-model-list | /docs/get-model-list | 42 |
| https://maas.antdigital.com/dt-maas-docs/model-fallback | /docs/model-fallback | 12 |
| https://maas.antdigital.com/dt-maas-docs/lingdt-decision-api-guide | /docs/lingdt-decision-api-guide | 25 |
| https://maas.antdigital.com/dt-maas-docs/agent-guides/codex | /docs/agent-guides/codex | 16 |
| https://maas.antdigital.com/dt-maas-docs/agent-guides/opencode | /docs/agent-guides/opencode | 11 |
| https://maas.antdigital.com/dt-maas-docs/console/model-marketplace | /docs/console/model-marketplace | 4 |
| https://maas.antdigital.com/dt-maas-docs/console/api-key | /docs/console/api-key | 6 |
| https://maas.antdigital.com/dt-maas-docs/console/account-management | /docs/console/account-management | 7 |
| https://maas.antdigital.com/dt-maas-docs/console/space-management | /docs/console/space-management | 18 |
| https://maas.antdigital.com/dt-maas-docs/platform-api/get-ak-sk | /docs/platform-api/get-ak-sk | 15 |
| https://maas.antdigital.com/dt-maas-docs/platform-api/query-api-usage | /docs/platform-api/query-api-usage | 10 |
| https://maas.antdigital.com/dt-maas-docs/updates/ling-3-2-flash-free-ending | /docs/updates/ling-3-2-flash-free-ending | 4 |
| https://maas.antdigital.com/dt-maas-docs/updates/atria-dawn-free-ending | /docs/updates/atria-dawn-free-ending | 4 |
| https://maas.antdigital.com/dt-maas-docs/updates/ming-image-design-free-ending | /docs/updates/ming-image-design-free-ending | 4 |
| https://maas.antdigital.com/dt-maas-docs/updates/lingdt-decision-1-1-upgrade | /docs/updates/lingdt-decision-1-1-upgrade | 5 |
| https://maas.antdigital.com/dt-maas-docs/updates/atria-dawn-migration | /docs/updates/atria-dawn-migration | 3 |
| https://maas.antdigital.com/dt-maas-docs/updates/ling-3-1-flash-free-ending | /docs/updates/ling-3-1-flash-free-ending | 4 |
| https://maas.antdigital.com/dt-maas-docs/updates/ling-3-0-flash-sante-free-ending | /docs/updates/ling-3-0-flash-sante-free-ending | 4 |
| https://maas.antdigital.com/dt-maas-docs/updates/ling-3-0-flash-fin-free-ending | /docs/updates/ling-3-0-flash-fin-free-ending | 4 |
| https://maas.antdigital.com/dt-maas-docs/updates/ling-3-0-flash-vl-free-period-ending | /docs/updates/ling-3-0-flash-vl-free-period-ending | 4 |
| https://maas.antdigital.com/dt-maas-docs/updates/deepseek-v4-flash-retirement | /docs/updates/deepseek-v4-flash-retirement | 4 |
| https://maas.antdigital.com/dt-maas-docs/updates/model-offline-260909 | /docs/updates/model-offline-260909 | 4 |
| https://maas.antdigital.com/dt-maas-docs/about/lingdt-decision-release | /docs/about/lingdt-decision-release | 3 |
| https://maas.antdigital.com/dt-maas-docs/about/caict-evaluation | /docs/about/caict-evaluation | 1 |

## 模型路由明细

以下每项均读取了公开详情。原站参数缺失与未公布字段未补造数值。

| 模型 | 原站详情 | 本地详情 |
|---|---|---|
| LingSante-3.1-air-VL | https://maas.antdigital.com/models/modelservice-1795159436696001932 | /models/modelservice-1795159436696001932 |
| LingSante-MedGuard-4B | https://maas.antdigital.com/models/modelservice-1794920007808001899 | /models/modelservice-1794920007808001899 |
| Qwen4-Max | https://maas.antdigital.com/models/modelservice-1794800520231001850 | /models/modelservice-1794800520231001850 |
| LingSante-3.1-flash | https://maas.antdigital.com/models/modelservice-1795159402147001536 | /models/modelservice-1795159402147001536 |
| MiniMax-H3-Image-Highspeed | https://maas.antdigital.com/models/modelservice-1794385590648001748 | /models/modelservice-1794385590648001748 |
| MiniMax-H3-Image | https://maas.antdigital.com/models/modelservice-1794385497197001367 | /models/modelservice-1794385497197001367 |
| Ling-3.2-flash | https://maas.antdigital.com/models/modelservice-1793847340277001619 | /models/modelservice-1793847340277001619 |
| LingDT-Decision-Fast-1.0 | https://maas.antdigital.com/models/modelservice-1795057387430001240 | /models/modelservice-1795057387430001240 |
| LingDT-Decision-1.1-4B | https://maas.antdigital.com/models/modelservice-1793604168840001989 | /models/modelservice-1793604168840001989 |
| LingDT-Decision-1.1-27B | https://maas.antdigital.com/models/modelservice-1793603857831001589 | /models/modelservice-1793603857831001589 |
| Qwen-Audio-3.1-ASR-Flash-Filetrans | https://maas.antdigital.com/models/modelservice-1793344804740001769 | /models/modelservice-1793344804740001769 |
| Qwen-Audio-3.1-ASR-Flash-Streaming | https://maas.antdigital.com/models/modelservice-1793344711032001585 | /models/modelservice-1793344711032001585 |
| Qwen-Audio-3.1-ASR-Flash | https://maas.antdigital.com/models/modelservice-1793344584649001286 | /models/modelservice-1793344584649001286 |
| Kimi K3.1 Pro Highspeed | https://maas.antdigital.com/models/modelservice-1792826340942001471 | /models/modelservice-1792826340942001471 |
| GLM-5.3-FlashX-Legal | https://maas.antdigital.com/models/modelservice-1793111693969001117 | /models/modelservice-1793111693969001117 |
| LingDT-TTS-CC-2.0 | https://maas.antdigital.com/models/modelservice-1794215054529001720 | /models/modelservice-1794215054529001720 |
| DeepSeek-V4.1-Flash-1017 | https://maas.antdigital.com/models/modelservice-1793104890402001465 | /models/modelservice-1793104890402001465 |
| Kimi K3.1 Pro | https://maas.antdigital.com/models/modelservice-1792805839867001405 | /models/modelservice-1792805839867001405 |
| LingDT-Decision-1.0 | https://maas.antdigital.com/models/modelservice-1792325631780001741 | /models/modelservice-1792325631780001741 |
| GLM-5.3-Prime | https://maas.antdigital.com/models/modelservice-1793111537823001988 | /models/modelservice-1793111537823001988 |
| Qwen3.8-Omni-Flash-Realtime | https://maas.antdigital.com/models/modelservice-1792656860861001732 | /models/modelservice-1792656860861001732 |
| Qwen3.5-Omni-Plus-Realtime | https://maas.antdigital.com/models/modelservice-1792656762230001730 | /models/modelservice-1792656762230001730 |
| Viggle-H3 | https://maas.antdigital.com/models/modelservice-1793278303000001321 | /models/modelservice-1793278303000001321 |
| Qwen3.5-Omni-Flash-Realtime | https://maas.antdigital.com/models/modelservice-1792640845831001656 | /models/modelservice-1792640845831001656 |
| Ling-3.1-Flash | https://maas.antdigital.com/models/modelservice-1790229240754001388 | /models/modelservice-1790229240754001388 |
| MiniMax-H3-Fast | https://maas.antdigital.com/models/modelservice-1792064232271001688 | /models/modelservice-1792064232271001688 |
| MiniMax M3.1 Flash | https://maas.antdigital.com/models/modelservice-1792478452568001466 | /models/modelservice-1792478452568001466 |
| Atria Dawn | https://maas.antdigital.com/models/modelservice-1792143118274001911 | /models/modelservice-1792143118274001911 |
| MiMo-V2.6-Pro-UltraSpeed | https://maas.antdigital.com/models/modelservice-1790045504686001648 | /models/modelservice-1790045504686001648 |
| StepFun 5 Preview | https://maas.antdigital.com/models/modelservice-1791787142032001608 | /models/modelservice-1791787142032001608 |
| Ling-3.0-flash-Sante | https://maas.antdigital.com/models/modelservice-1788331411494001201 | /models/modelservice-1788331411494001201 |
| Jev 1.13 | https://maas.antdigital.com/models/modelservice-1790521330337001407 | /models/modelservice-1790521330337001407 |
| LingDT-OCR-1.1 | https://maas.antdigital.com/models/modelservice-1789906291802001676 | /models/modelservice-1789906291802001676 |
| Kimi K2.8 Preview | https://maas.antdigital.com/models/modelservice-1789962077313001713 | /models/modelservice-1789962077313001713 |
| Wan3.0-Video-Prime | https://maas.antdigital.com/models/modelservice-1790061394775001912 | /models/modelservice-1790061394775001912 |
| GLM-5.3-FlashX | https://maas.antdigital.com/models/modelservice-1789715354383001462 | /models/modelservice-1789715354383001462 |
| Ling-3.0-flash-VL | https://maas.antdigital.com/models/modelservice-1788265478122001738 | /models/modelservice-1788265478122001738 |
| MiMo-V2.6-Flash | https://maas.antdigital.com/models/modelservice-1790045388943001985 | /models/modelservice-1790045388943001985 |
| Qwen-Image-3.0-Pro | https://maas.antdigital.com/models/modelservice-1785985872362001597 | /models/modelservice-1785985872362001597 |
| MiMo-V2.6-Pro | https://maas.antdigital.com/models/modelservice-1790045316874001705 | /models/modelservice-1790045316874001705 |
| DeepSeek-V4.1-Flash | https://maas.antdigital.com/models/modelservice-1789030303888001186 | /models/modelservice-1789030303888001186 |
| Kimi K3 | https://maas.antdigital.com/models/modelservice-1786686156006001910 | /models/modelservice-1786686156006001910 |
| Qwen-Image-3.0 | https://maas.antdigital.com/models/modelservice-1785985854107001982 | /models/modelservice-1785985854107001982 |
| Qwen3.8-Flash | https://maas.antdigital.com/models/modelservice-1788174495570001431 | /models/modelservice-1788174495570001431 |
| Ming-Image-0.1-Design-Layer | https://maas.antdigital.com/models/modelservice-1788923727244001352 | /models/modelservice-1788923727244001352 |
| qwen-image-2.0-pro | https://maas.antdigital.com/models/modelservice-1780564045424001462 | /models/modelservice-1780564045424001462 |
| GLM-5.3-Flash | https://maas.antdigital.com/models/modelservice-1787800000501001534 | /models/modelservice-1787800000501001534 |
| DeepSeek-V4-Pro-0813 | https://maas.antdigital.com/models/modelservice-1786949299916001801 | /models/modelservice-1786949299916001801 |
| Ling-3.0-flash-Fin | https://maas.antdigital.com/models/modelservice-1787725633593001818 | /models/modelservice-1787725633593001818 |
| DeepSeek-V4-Flash-0731 | https://maas.antdigital.com/models/modelservice-1785750130899001085 | /models/modelservice-1785750130899001085 |
| Qwen3.8-Max | https://maas.antdigital.com/models/modelservice-1785749681782001144 | /models/modelservice-1785749681782001144 |
| Ming-Image-0.1-Design | https://maas.antdigital.com/models/modelservice-1788918605869001081 | /models/modelservice-1788918605869001081 |
| GLM-5.3 | https://maas.antdigital.com/models/modelservice-1787120803874001484 | /models/modelservice-1787120803874001484 |
| MiniMax-H3 | https://maas.antdigital.com/models/modelservice-1786959834449001317 | /models/modelservice-1786959834449001317 |
| LingDT-3.0-flash | https://maas.antdigital.com/models/modelservice-1786935614164001676 | /models/modelservice-1786935614164001676 |
| GLM 5.2 | https://maas.antdigital.com/models/modelservice-1781676134857001972 | /models/modelservice-1781676134857001972 |
| MiniMax M3 | https://maas.antdigital.com/models/modelservice-1780379982192001893 | /models/modelservice-1780379982192001893 |
| DeepSeek-V4-Flash | https://maas.antdigital.com/models/modelService-1777183937454001352 | /models/modelService-1777183937454001352 |
| Kimi K2.7 Code | https://maas.antdigital.com/models/modelservice-1781609300884001432 | /models/modelservice-1781609300884001432 |
| HappyHorse-1.1-R2V | https://maas.antdigital.com/models/modelservice-1782453578858001518 | /models/modelservice-1782453578858001518 |
| DeepSeek-V4-Pro | https://maas.antdigital.com/models/modelService-1777183123563001128 | /models/modelService-1777183123563001128 |
| Step 3.7 Flash | https://maas.antdigital.com/models/modelservice-1781676868296001523 | /models/modelservice-1781676868296001523 |
| Qwen3.7-Plus | https://maas.antdigital.com/models/modelservice-1780563071461001549 | /models/modelservice-1780563071461001549 |
| MiniMax M2.7 | https://maas.antdigital.com/models/modelservice-1778254864380001847 | /models/modelservice-1778254864380001847 |
| Qwen3.7-Max | https://maas.antdigital.com/models/modelservice-1779429167049001300 | /models/modelservice-1779429167049001300 |
| GLM 5.1 | https://maas.antdigital.com/models/modelservice-1778571907203001625 | /models/modelservice-1778571907203001625 |
| Kimi K2.6 | https://maas.antdigital.com/models/modelservice-1778663450171001404 | /models/modelservice-1778663450171001404 |
| HappyHorse-1.1-T2V | https://maas.antdigital.com/models/modelservice-1782453481392001591 | /models/modelservice-1782453481392001591 |
| Qwen3-TTS-Flash | https://maas.antdigital.com/models/modelservice-1782455018105001662 | /models/modelservice-1782455018105001662 |
| HappyHorse-1.1-I2V | https://maas.antdigital.com/models/modelservice-1782453233804001192 | /models/modelservice-1782453233804001192 |
| Wan2.7-T2V | https://maas.antdigital.com/models/modelservice-1779384038728001649 | /models/modelservice-1779384038728001649 |
| Qwen3-ASR-Flash | https://maas.antdigital.com/models/modelservice-1782455217849001933 | /models/modelservice-1782455217849001933 |
| Wan2.7-I2V | https://maas.antdigital.com/models/modelservice-1779384039111001075 | /models/modelservice-1779384039111001075 |
| Wan2.7-R2V | https://maas.antdigital.com/models/modelservice-1779384039372001016 | /models/modelservice-1779384039372001016 |
| HappyHorse-1.0-video-edit | https://maas.antdigital.com/models/modelservice-1778498788689001739 | /models/modelservice-1778498788689001739 |
| HappyHorse-1.0-r2v | https://maas.antdigital.com/models/modelservice-1778498726601001415 | /models/modelservice-1778498726601001415 |
| HappyHorse-1.0-i2v | https://maas.antdigital.com/models/modelservice-1778498630966001104 | /models/modelservice-1778498630966001104 |
| Qwen3.6-Plus | https://maas.antdigital.com/models/modelService-1776177344042001233 | /models/modelService-1776177344042001233 |
| Qwen-Image-2.0 | https://maas.antdigital.com/models/modelService-1776180141701001395 | /models/modelService-1776180141701001395 |
| Happyhorse-1.0-t2v | https://maas.antdigital.com/models/modelservice-1778498487411001775 | /models/modelservice-1778498487411001775 |
| 通用文本向量-v3 | https://maas.antdigital.com/models/modelservice-1780388803227001835 | /models/modelservice-1780388803227001835 |
| Qwen3 Rerank | https://maas.antdigital.com/models/modelservice-1779982002588001570 | /models/modelservice-1779982002588001570 |
| Text Embedding v4 | https://maas.antdigital.com/models/modelservice-1779981816347001884 | /models/modelservice-1779981816347001884 |
| Qwen3-ASR-Flash-Filetrans | https://maas.antdigital.com/models/modelservice-1782460255152001065 | /models/modelservice-1782460255152001065 |
| Wan2.7-videoedit | https://maas.antdigital.com/models/modelservice-1779366618864001388 | /models/modelservice-1779366618864001388 |
| Wan2.6-T2I | https://maas.antdigital.com/models/modelservice-1779365948338001295 | /models/modelservice-1779365948338001295 |
| Wan2.7-image | https://maas.antdigital.com/models/modelservice-1779365753222001051 | /models/modelservice-1779365753222001051 |
| qwen3.6-27b | https://maas.antdigital.com/models/modelservice-1779356862398001053 | /models/modelservice-1779356862398001053 |
| qwen3.5-27b | https://maas.antdigital.com/models/modelservice-1779355926579001452 | /models/modelservice-1779355926579001452 |
| qwen3.6-flash | https://maas.antdigital.com/models/modelservice-1778741680849001626 | /models/modelservice-1778741680849001626 |
| Qwen-Flash | https://maas.antdigital.com/models/modelservice-1778741649445001997 | /models/modelservice-1778741649445001997 |
| Qwen3.5-Omni-Flash | https://maas.antdigital.com/models/modelservice-1778490620952001809 | /models/modelservice-1778490620952001809 |
| Qwen3-235B-A22B | https://maas.antdigital.com/models/modelservice-1778254641279001701 | /models/modelservice-1778254641279001701 |
| Qwen-Max | https://maas.antdigital.com/models/modelService-qwen-max | /models/modelService-qwen-max |
| Qwen-Plus | https://maas.antdigital.com/models/modelService-qwen-plus | /models/modelService-qwen-plus |
| Qwen3.5-397B-A17B | https://maas.antdigital.com/models/modelService-Qwen3.5-397B-A17B | /models/modelService-Qwen3.5-397B-A17B |
| Qwen3-Coder-Flash | https://maas.antdigital.com/models/modelService-1776737915826001005 | /models/modelService-1776737915826001005 |
| Qwen-image-max | https://maas.antdigital.com/models/modelService-1776609433691001043 | /models/modelService-1776609433691001043 |
| Qwen3.5-flash | https://maas.antdigital.com/models/modelService-1776359737361001840 | /models/modelService-1776359737361001840 |
| Qwen-image-plus | https://maas.antdigital.com/models/modelService-1776180897810001134 | /models/modelService-1776180897810001134 |
| Qwen3.5-Plus | https://maas.antdigital.com/models/mod-1789234567890123456 | /models/mod-1789234567890123456 |
| Kimi K2.5 | https://maas.antdigital.com/models/mod-1789234567890123463 | /models/mod-1789234567890123463 |
| MiniMax-M2.5 | https://maas.antdigital.com/models/mod-1789234567890123462 | /models/mod-1789234567890123462 |
| DeepSeek-V3.2 | https://maas.antdigital.com/models/mod-1789234567890123461 | /models/mod-1789234567890123461 |
| Qwen3-VL-Plus | https://maas.antdigital.com/models/mod-1789234567890123460 | /models/mod-1789234567890123460 |
| Qwen-Audio-3.0-ASR-Flash | https://maas.antdigital.com/models/modelservice-1788255269673001452 | /models/modelservice-1788255269673001452 |
| MiniMax Speech 2.6 HD | https://maas.antdigital.com/models/modelservice-1782994498946001080 | /models/modelservice-1782994498946001080 |
| MiniMax Speech 2.8 HD | https://maas.antdigital.com/models/modelservice-1782994441633001144 | /models/modelservice-1782994441633001144 |
| Fun-ASR语音识别 | https://maas.antdigital.com/models/modelservice-1782962418569001859 | /models/modelservice-1782962418569001859 |
| Paraformer语音识别-v2 | https://maas.antdigital.com/models/modelservice-1782962283892001434 | /models/modelservice-1782962283892001434 |
| Fun-ASR实时语音识别 | https://maas.antdigital.com/models/modelservice-1783678625991001055 | /models/modelservice-1783678625991001055 |
| Qwen3.5-OCR | https://maas.antdigital.com/models/modelservice-1784882475980001201 | /models/modelservice-1784882475980001201 |
| QwenVL-OCR-2025-11-20 | https://maas.antdigital.com/models/modelservice-1784882358788001989 | /models/modelservice-1784882358788001989 |
| Qwen3.7-通用文本向量 | https://maas.antdigital.com/models/modelservice-1785248815400001387 | /models/modelservice-1785248815400001387 |
| Qwen3.7-Flash | https://maas.antdigital.com/models/modelservice-1785230487050001416 | /models/modelservice-1785230487050001416 |
| 深度文本重排序 | https://maas.antdigital.com/models/modelservice-1786536633323001900 | /models/modelservice-1786536633323001900 |
| Qwen3-TTS-Flash-Realtime | https://maas.antdigital.com/models/modelservice-1785930308708001989 | /models/modelservice-1785930308708001989 |
| Qwen3.8-27B | https://maas.antdigital.com/models/modelservice-1787296900616001143 | /models/modelservice-1787296900616001143 |
| 万相3.0-视频生成 | https://maas.antdigital.com/models/modelservice-1787196086783001359 | /models/modelservice-1787196086783001359 |
| LingDT-ASR-CC-0.6B | https://maas.antdigital.com/models/modelservice-1788873043170001998 | /models/modelservice-1788873043170001998 |
| Atria Dawn Preview | https://maas.antdigital.com/models/modelservice-1789566449651001764 | /models/modelservice-1789566449651001764 |
| Paraformer实时语音识别-v2 | https://maas.antdigital.com/models/modelservice-1789376040871001344 | /models/modelservice-1789376040871001344 |
| Qwen-Long | https://maas.antdigital.com/models/modelservice-1789112393568001396 | /models/modelservice-1789112393568001396 |
| Kling Video 3.0 | https://maas.antdigital.com/models/modelservice-1789790382232001015 | /models/modelservice-1789790382232001015 |
| Qwen3.5-Omni-Plus | https://maas.antdigital.com/models/modelservice-1789788812528001456 | /models/modelservice-1789788812528001456 |
| Z-Image-Turbo | https://maas.antdigital.com/models/modelservice-1790237381968001100 | /models/modelservice-1790237381968001100 |
| Qwen3.8-2.4T-A95B | https://maas.antdigital.com/models/modelservice-1792036124876001442 | /models/modelservice-1792036124876001442 |

## 资料与业务缺口

- 核心四入口及保留文档/模型的公开数据未遇到无法读取的页面；原站浏览器交互受系统捕获偶发失败影响，部分折叠内容与字段由官方源码/公开接口补核。不能将此记录理解为人工逐页、逐控件验收了原站全部 UI 状态。
- 9 个原站模型示例存在操作路径不明确、内容不完整或 WebSocket 地址缺少 Velink 配置，详见 unavailable-examples.json。未推断或伪造接口。
- 45 张来源插图均已实测宽高；缺失尺寸 0，详见 image-dimensions.json 和 missing-images.json。当前使用占位块；正式替换需提供自有/授权素材。
- 缺少 Velink 正式 API Base/Root、账户与控制台、购买、联系方式、法律主体/隐私/条款 URL、正式套餐报价与额度、模型报价。配置入口为 .env.example 与 src/config/site.js。管理类原平台 AK/SK SDK 示例仅作参考，不代表本站已提供同名服务。

## 本地验证

- npm run build：生产构建通过；模型详情独立分包按需加载。
- npm run lint：通过，无新增告警。
- npm test：22 项通过（含全部生成 Python/Shell 模型示例的语法检查）。
- 浏览器实测：首页 → 模型市场 → 搜索 qwen4-max → 详情，URL 与模型名称/规格对应；本地页面正常渲染。
- 390px iframe 布局视口：首页、模型市场、Token Plan、Codex 深层文档均显示 PASS，内容宽度 = 视口宽度 = 390px。1280px 套餐页面亦显示 PASS。
- 桌面首屏、模型详情与套餐页已查看；四页手机首屏已查看。没有声称穷举每个设备、每一表格滚动位置或全部浏览器组合。
- 深层静态访问通过 Vite history fallback；测试覆盖末页模型、筛选空态/重置、套餐所选项/开通目标、文档深路由、语言切换后的复制。没有调用真实推理、账户或交易服务。

本地运行：npm run dev -- --host 127.0.0.1；当前地址 http://127.0.0.1:5173/ 。
