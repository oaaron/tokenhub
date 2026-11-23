import { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  Plus,
  Search,
  KeyRound,
  Layers3,
  ShieldCheck,
  Zap,
  Trash2,
} from "lucide-react";
import {
  Button,
  Input,
  Card,
  CardHeader,
  CardFooter,
} from "../../design-system";
import { SectionHeading, Tag, CopyButton } from "./PreviewPrimitives";
export default function ComponentGallery() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const timer = useRef();
  useEffect(() => () => clearTimeout(timer.current), []);
  function simulate() {
    setLoading(true);
    setMessage("");
    timer.current = setTimeout(() => {
      setLoading(false);
      setMessage("操作完成：这是本地交互演示。");
    }, 1200);
  }
  return (
    <section id="components" className="preview-section section-anchor">
      <SectionHeading
        index="05"
        title="基础组件"
        english="Components"
        description="以可复用的基础单元构建界面。每个组件都拥有明确的层级、完整的状态与一致的操作反馈。"
      />
      <div className="component-block">
        <div className="component-label">
          <h3>
            按钮 <span>Button</span>
          </h3>
          <Tag>4 variants · 3 sizes</Tag>
        </div>
        <div className="button-showcase">
          <div className="example-row">
            <span className="row-label">层级</span>
            <Button icon={Plus} onClick={() => setMessage("主要操作已触发。")}>
              创建 API Key
            </Button>
            <Button
              variant="secondary"
              onClick={() => setMessage("次要操作已触发。")}
            >
              查看文档 <ArrowRight size={14} />
            </Button>
            <Button
              variant="ghost"
              onClick={() => setMessage("文字操作已触发。")}
            >
              了解更多 <ArrowRight size={14} />
            </Button>
            <Button
              variant="danger"
              icon={Trash2}
              onClick={() => setMessage("危险操作样式演示，未执行任何删除。")}
            >
              删除
            </Button>
          </div>
          <div className="example-row">
            <span className="row-label">尺寸</span>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setMessage("Small · 32px")}
            >
              Small
            </Button>
            <Button
              variant="secondary"
              onClick={() => setMessage("Medium · 40px")}
            >
              Medium
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => setMessage("Large · 48px")}
            >
              Large
            </Button>
            <div className="example-divider" />
            <Button loading={loading} onClick={simulate}>
              {loading ? "处理中" : "体验加载"}
            </Button>
            <Button disabled>不可用</Button>
          </div>
        </div>
        <div className="code-strip">
          <code>
            {'<Button variant="primary" icon={Plus}>创建 API Key</Button>'}
          </code>
          <CopyButton
            text={'<Button variant="primary" icon={Plus}>创建 API Key</Button>'}
          />
        </div>
        <p className="interaction-status" role="status">
          {message || "点击按钮，体验交互反馈。加载状态下自动阻止重复操作。"}
        </p>
      </div>
      <div className="component-block">
        <div className="component-label">
          <h3>
            输入框 <span>Input</span>
          </h3>
          <Tag>Label · Hint · Validation</Tag>
        </div>
        <div className="input-grid">
          <Input
            label="默认状态"
            placeholder="请输入 API Key 名称"
            hint="为密钥取一个容易识别的名字"
          />
          <Input
            label="搜索输入"
            placeholder="搜索模型、提供商…"
            icon={Search}
          />
          <Input
            label="错误状态"
            defaultValue="sk-"
            icon={KeyRound}
            error="请输入完整的 API Key"
          />
          <Input label="禁用状态" value="由管理员管理" disabled readOnly />
        </div>
      </div>
      <div className="component-block">
        <div className="component-label">
          <h3>
            卡片 <span>Card</span>
          </h3>
          <Tag>Default · Subtle · Elevated</Tag>
        </div>
        <div className="cards-grid">
          {[
            {
              icon: Layers3,
              variant: "default",
              name: "统一模型接入",
              caption: "Default",
              text: "用一致的交互方式呈现模型与连接。",
            },
            {
              icon: ShieldCheck,
              variant: "subtle",
              name: "企业用量治理",
              caption: "Subtle",
              text: "让预算、权限与使用情况清晰有序。",
            },
            {
              icon: Zap,
              variant: "elevated",
              name: "可靠的服务体验",
              caption: "Elevated",
              text: "让重要信息拥有恰到好处的视觉层级。",
            },
          ].map(({ icon: Icon, variant, name, caption, text }) => (
            <Card key={variant} variant={variant}>
              <CardHeader>
                <span className="component-icon">
                  <Icon size={20} />
                </span>
                <code>{caption}</code>
              </CardHeader>
              <h4>{name}</h4>
              <p>{text}</p>
              <CardFooter>
                <span>基础组件 / 组合示例</span>
                <ArrowRight size={16} />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
