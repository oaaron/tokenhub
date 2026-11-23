import { useState } from "react";
import {
  Activity,
  ArrowUpRight,
  Check,
  KeyRound,
  Layers3,
  Plus,
  Search,
  X,
} from "lucide-react";
import { Button, Card, Input } from "../../design-system";
import { SectionHeading, Tag } from "./PreviewPrimitives";
const models = [
  {
    name: "通用语言模型",
    type: "文本生成",
    mark: "L",
    color: "blue",
    description: "面向问答、内容与业务助手的模型接入示例。",
  },
  {
    name: "推理模型",
    type: "逻辑推理",
    mark: "R",
    color: "purple",
    description: "面向复杂分析与多步骤任务的模型接入示例。",
  },
  {
    name: "多模态模型",
    type: "图像理解",
    mark: "M",
    color: "green",
    description: "面向图文输入与信息理解的模型接入示例。",
  },
];
export default function GatewayExample() {
  const [query, setQuery] = useState("");
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState("");
  const [selected, setSelected] = useState("");
  const filtered = models.filter((model) =>
    `${model.name}${model.type}`.includes(query.trim()),
  );
  function submit(event) {
    event.preventDefault();
    if (!name.trim()) {
      setError("请输入密钥名称");
      return;
    }
    setSaved(name.trim());
    setCreating(false);
    setName("");
    setError("");
  }
  return (
    <section id="patterns" className="preview-section section-anchor">
      <SectionHeading
        index="06"
        title="组合应用"
        english="Patterns"
        description="当设计基础与组件协同工作，形成完整的产品体验。以下为本地演示，所有指标均为示例数据。"
      />
      <div className="gateway-frame">
        <div className="gateway-toolbar">
          <div>
            <span className="app-mark">
              <Layers3 size={17} />
            </span>
            <strong>工作空间</strong>
            <span className="toolbar-divider" />
            <small>模型概览</small>
          </div>
          <Tag>交互示例</Tag>
        </div>
        <div className="gateway-body">
          <div className="gateway-heading">
            <div>
              <h3>连接你的下一个可能。</h3>
              <p>在一个工作空间，管理模型与应用。</p>
            </div>
            <Button
              icon={Plus}
              size="sm"
              onClick={() => {
                setCreating(!creating);
                setError("");
              }}
            >
              创建示例密钥
            </Button>
          </div>
          {creating && (
            <form className="demo-form" onSubmit={submit}>
              <Input
                label="密钥名称"
                placeholder="例如：业务助手"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                }}
                error={error}
                autoFocus
                maxLength={48}
              />
              <Button type="submit" size="sm">
                创建
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCreating(false)}
              >
                取消
              </Button>
            </form>
          )}
          <div role="status" className="demo-status">
            {saved && (
              <>
                <Check size={14} /> 示例配置「{saved}
                」已创建，仅保存在当前页面，不会生成真实密钥。
              </>
            )}
          </div>
          <div className="metrics-grid">
            {[
              { title: "模型连接", value: "03", unit: "个", icon: Layers3 },
              {
                title: "本月调用",
                value: "128,640",
                unit: "次",
                icon: Activity,
              },
              {
                title: "应用密钥",
                value: saved ? "09" : "08",
                unit: "个",
                icon: KeyRound,
              },
            ].map(({ title, value, unit, icon: Icon }) => (
              <Card key={title}>
                <div>
                  <span>{title}</span>
                  <Icon size={15} />
                </div>
                <strong>
                  {value}
                  <small>{unit}</small>
                </strong>
                <small className="sample-label">示例数据</small>
              </Card>
            ))}
          </div>
          <div className="model-heading">
            <strong>
              探索模型 <span>{filtered.length}</span>
            </strong>
            <Input
              aria-label="搜索示例模型"
              icon={Search}
              placeholder="搜索模型…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="model-grid">
            {filtered.map((model) => (
              <Card key={model.mark}>
                <div className="model-top">
                  <span className={`model-mark mark-${model.color}`}>
                    {model.mark}
                  </span>
                  <Tag tone="success">示例连接</Tag>
                </div>
                <h4>{model.name}</h4>
                <span className="model-type">{model.type}</span>
                <p>{model.description}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelected(model.name)}
                >
                  查看示例 <ArrowUpRight size={14} />
                </Button>
              </Card>
            ))}
          </div>
          {!filtered.length && (
            <div className="empty-state">
              没有匹配的示例模型。
              <Button variant="ghost" size="sm" onClick={() => setQuery("")}>
                清空搜索
              </Button>
            </div>
          )}
          {selected && (
            <div className="model-detail">
              <div>
                <strong>{selected}</strong>
                <p>
                  此卡片用于展示模型发现流程。未对接真实供应商、价格或 API。
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                icon={X}
                onClick={() => setSelected("")}
              >
                关闭
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="pattern-note">
        <span>
          <i /> 从变量到组件，从组件到体验。
        </span>
        <code>
          import &#123; Button, Input, Card &#125; from '@/design-system'
        </code>
      </div>
    </section>
  );
}
