import "../../styles/maker-loop.css";
import LogoLoop from "../../components/LogoLoop/LogoLoop";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Code2,
  Layers3,
  Network,
  ShieldCheck,
} from "lucide-react";
import { Button } from "../../design-system";
import { LinkButton } from "../../components/site/LinkButton";
import { makerLogos, recommendedModels, newsItems } from "../../content/home";
export default function HomePage() {
  const [slide, setSlide] = useState(0);
  const featured = newsItems[slide];
  return (
    <>
      <section className="site-container home-hero">
        <div className="hero-content">
          <h1>
            为每一项任务，
            <br />
            找到<span>合适的模型。</span>
          </h1>
          <p className="hero-lead">从模型选择，到统一 API 接入。</p>
          <p className="hero-description">
            比较模型能力与参考价格，规划用量和套餐。
            <br />
            按接入文档完成配置，正式可用范围以服务开通信息为准。
          </p>
          <div className="hero-cta">
            <LinkButton to="/models" size="lg">
              浏览模型 <ArrowRight size={17} />
            </LinkButton>
            <LinkButton to="/docs/quick-access" size="lg" variant="secondary">
              <Code2 size={17} /> 快速接入
            </LinkButton>
          </div>
          <div className="hero-footnote">
            <ShieldCheck size={14} /> 统一接口 <span /> 多模态能力 <span />{" "}
            清晰的接入文档
          </div>
        </div>
        <div className="product-visual" aria-label="TokenHub 统一模型网关示意">
          <div className="visual-top">
            <span className="visual-dot" /> 模型网关{" "}
            <span className="visual-version">TokenHub / 01</span>
          </div>
          <div className="visual-hub">
            <div className="visual-orbit orbit-one" />
            <div className="visual-orbit orbit-two" />
            <div className="visual-center">
              <Layers3 size={38} />
              <strong>TokenHub</strong>
              <small>统一模型入口</small>
            </div>
            <div className="orbit-chip chip-one">
              <Code2 size={15} /> 应用
            </div>
            <div className="orbit-chip chip-two">
              <Network size={15} /> 模型
            </div>
            <div className="orbit-chip chip-three">Qwen</div>
            <div className="orbit-chip chip-four">DeepSeek</div>
            <div className="orbit-chip chip-five">OpenAI</div>
          </div>
          <div className="visual-bottom">
            <code>POST /v1/chat/completions</code>
            <Link to="/docs/quick-access" aria-label="阅读 API 接入说明">
              <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
      </section>
      <section className="maker-section">
        <div className="site-container">
          <div className="maker-logo-loop">
            <LogoLoop
              logos={makerLogos}
              speed={48}
              direction="left"
              logoHeight={30}
              gap={52}
              hoverSpeed={0}
              fadeOut
              fadeOutWidth={0.06}
              scaleOnHover
              labels="inline"
              muted={0.35}
              ariaLabel="模型厂商，点击浏览对应模型"
            />
          </div>
        </div>
      </section>
      <section className="site-container home-news">
        <div className="section-intro">
          <div>
            <h2>从不同模型生态开始探索</h2>
            <p className="muted">
              以下模型来自同一目录，点击查看完整规格。目录展示不代表已开通调用。
            </p>
          </div>
          <Link to="/models">
            查看全部模型 <ArrowRight size={14} />
          </Link>
        </div>
        <div className="news-grid">
          {recommendedModels.map((model) => (
            <Link
              className="news-card"
              to={`/models/${model.slug}`}
              key={model.slug}
            >
              <span>{model.provider}</span>
              <h3>{model.displayName || model.name}</h3>
              <p>
                {model.zhDescription ||
                  model.description ||
                  "查看模型能力、协议与参考计价。"}
              </p>
              <ArrowUpRight size={16} />
            </Link>
          ))}
        </div>
      </section>
      <section className="site-container home-news">
        <div className="section-intro">
          <div>
            <h2>选择、接入与用量，一步步了解。</h2>
          </div>
          <div className="news-controls">
            <span>
              {String(slide + 1).padStart(2, "0")} /{" "}
              {String(newsItems.length).padStart(2, "0")}
            </span>
            <Button
              variant="secondary"
              size="sm"
              icon={ChevronLeft}
              aria-label="上一条资讯"
              onClick={() =>
                setSlide((slide + newsItems.length - 1) % newsItems.length)
              }
            />
            <Button
              variant="secondary"
              size="sm"
              icon={ChevronRight}
              aria-label="下一条资讯"
              onClick={() => setSlide((slide + 1) % newsItems.length)}
            />
          </div>
        </div>
        <Link to={featured.to} className="news-featured">
          <span className="news-feature-icon">
            <Layers3 size={28} />
          </span>
          <div>
            <span className="eyebrow">{featured.label}</span>
            <h3>{featured.title}</h3>
            <p>{featured.description}</p>
          </div>
          <ArrowUpRight size={23} />
        </Link>
        <div className="news-grid">
          {newsItems.map((item) => (
            <Link to={item.to} className="news-card" key={item.to}>
              <span>{item.label}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <ArrowUpRight size={16} />
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
