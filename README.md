# TokenHub

基于 Vite、React、TailwindCSS v4 的企业模型服务网站。沿用项目已确定的设计系统，模型目录按 ZenMux 公开数据整理，界面使用 TokenHub 自有设计系统。

```sh
npm install
npm run dev -- --host 127.0.0.1
```

当前本地预览：http://127.0.0.1:5173/

- `/`：首页、模型生态与资讯。
- `/models`：257 条模型、筛选、连续滚动加载与对比。
- `/models/:id`：独立模型详情、计价与协议调用说明。
- `/pricing`：4 档月度方案结构、任务选型说明、6 项 FAQ。
- `/docs/intro`：34 篇独立文档，目录、锚点、代码切换与复制。
- `/design-system`：原设计系统预览。
- `/viewport-check.html`：四页 390px 布局视口检查。`?width=1280&page=pricing` 可单独检查桌面套餐页；page 可选 home/models/pricing/docs。

## 业务配置

复制 `.env.example` 为 `.env.local`，填写已有的真实服务地址。未配置时显示明确的服务状态，不创建模拟订单或虚构账户数据。

- `VITE_API_BASE_URL`：OpenAI 兼容 Base URL，包含 `/v1`。
- `VITE_API_ROOT_URL`：其他协议使用的服务根地址，不包含 `/v1`；默认从 Base URL 推导。
- `VITE_ACCOUNT_URL`、`VITE_PURCHASE_URL`、`VITE_CONTACT_URL`、`VITE_PRIVACY_URL`、`VITE_TERMS_URL`、`VITE_COMPANY_NAME`。
- 正式套餐价格、额度与单独购买目标：`src/config/site.js` 的 `planOffers`。
- 正式模型报价：同文件 `modelOffers`。目录价格用于选型，实际报价由业务配置提供。
- 真正的模型密钥仅在调用方服务端/终端配置为 `TOKENHUB_API_KEY`，不要写入任何 `VITE_*` 变量。

当前无账户、购买、计费或推理后端。生产部署需要把非静态资源的深层 URL 重写到 `index.html`。

## 验证

```sh
npm test
npm run lint
npm run build
node scripts/audit-runtime.mjs
```

测试语法核验需要 Python 3 与 Bash；macOS 本地环境已验证。覆盖清单与已知限制见 `docs/source-audit/coverage.md`。当前模型目录不生成未经服务配置验证的调用示例，统一提供协议与开通说明。文档图片以原图实测比例占位。

## 代码组织

- `src/App.jsx`：只渲染 RouterProvider。
- `src/router.jsx`：路由、布局与加载边界。
- `src/components/site/`：共享导航、卡片、筛选、代码与公告。
- `src/pages/site/`：页面组合。
- `src/content/`：模型索引、按需详情、套餐、文档与示例转换。
- `src/config/site.js`：业务服务配置。
- `src/design-system/`：原设计系统及统一 Tokens。

## 更新参考快照

仅在希望刷新参考内容时运行，更新后需重新核对公开范围和字段：

```sh
python3 scripts/sync-reference.py
python3 scripts/partition-models.py
python3 scripts/fetch-reference-docs.py
node scripts/extract-docs.cjs
node scripts/build-docs.cjs
node scripts/augment-doc-links.cjs
python3 scripts/measure-doc-images.py
```

文档构建脚本包含人工整理的正文。原平台的交易、数据处理、SLA、促销和认证不自动成为 TokenHub 的服务承诺。
