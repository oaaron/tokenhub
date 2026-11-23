import {
  ArrowUpRight,
  Layers3,
  MousePointer2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button, Card, CardHeader, CardFooter } from "../../design-system";
import { Tag } from "./PreviewPrimitives";
export default function Overview() {
  return (
    <section id="overview" className="overview section-anchor">
      <div className="intro-eyebrow">
        <span /> TokenHub 设计系统 <span className="eyebrow-line" /> V1.0
      </div>
      <div className="hero-layout">
        <div className="hero-copy">
          <h1>
            让复杂，
            <br />
            <span>回归清晰。</span>
          </h1>
          <p>
            一套为企业 AI 而生的设计语言。
            <br />
            以克制的视觉、统一的组件，构建清晰可信的产品体验。
          </p>
          <div className="hero-actions">
            <a className="hero-primary" href="#components">
              探索组件 <ArrowUpRight size={17} />
            </a>
            <a href="#colors" className="hero-text-link">
              查看设计基础 <span>↗</span>
            </a>
          </div>
        </div>
        <div className="hero-specimen" aria-label="组件组合预览">
          <div className="specimen-grid" />
          <div className="specimen-label">
            <Sparkles size={14} /> 清晰，一以贯之
          </div>
          <Card className="specimen-card">
            <CardHeader>
              <div className="specimen-icon">
                <Layers3 size={23} />
              </div>
              <Tag tone="success">已连接 · 示例</Tag>
            </CardHeader>
            <h3>一个入口，无限可能。</h3>
            <p>将模型、用量与治理连接在一起。</p>
            <div className="specimen-flow">
              <span>应用</span>
              <i />
              <span className="flow-hub">TokenHub</span>
              <i />
              <span>模型</span>
            </div>
            <CardFooter>
              <span className="mini-status">
                <span /> 统一的设计，连贯的体验
              </span>
              <Button
                size="sm"
                variant="secondary"
                icon={ArrowUpRight}
                aria-label="查看组合应用"
                onClick={() =>
                  document
                    .getElementById("patterns")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                预览
              </Button>
            </CardFooter>
          </Card>
          <div className="specimen-caption">
            <span>组件 / 基础规范 / 设计模式</span>
            <span>01 — 06</span>
          </div>
        </div>
      </div>
      <div className="principles">
        <div>
          <Layers3 size={18} />
          <span>
            <strong>一致，而非重复</strong>
            <small>从设计变量到产品语言</small>
          </span>
          <b>01</b>
        </div>
        <div>
          <MousePointer2 size={18} />
          <span>
            <strong>清晰，自有分寸</strong>
            <small>为每一次操作建立层级</small>
          </span>
          <b>02</b>
        </div>
        <div>
          <ShieldCheck size={18} />
          <span>
            <strong>可靠，始于细节</strong>
            <small>覆盖状态、反馈与无障碍</small>
          </span>
          <b>03</b>
        </div>
      </div>
    </section>
  );
}
