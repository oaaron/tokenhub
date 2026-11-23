import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Sparkles,
  Braces,
  Layers3,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { models } from "../../content/models.js";
const picks = [
  {
    match: "openai/gpt-6.2-astra",
    title: "复杂任务，更进一步。",
    text: "探索编码、研究与多步骤任务所需的模型能力。",
    label: "推理与代码",
    icon: Braces,
    tone: "blue",
  },
  {
    match: "google/gemini-4-neon",
    title: "多模态，让灵感成形。",
    text: "在一个目录中比较图像、视频与语言模型。",
    label: "多模态创作",
    icon: Sparkles,
    tone: "violet",
  },
  {
    match: "anthropic/claude-sonnet-5.5",
    title: "选对模型，连接工作流。",
    text: "核对上下文、最大输出与计价，开始构建。",
    label: "智能体工作流",
    icon: Layers3,
    tone: "mint",
  },
];
export default function ModelAnnouncements() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (paused || reduced) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % picks.length), 6000);
    return () => clearInterval(id);
  }, [paused, reduced]);
  const item = picks[index];
  const Icon = item.icon;
  const model = models.find((m) => m.name === item.match);
  return (
    <section
      className={`market-feature feature-${item.tone}`}
      aria-roledescription="轮播"
      aria-label="精选模型"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false);
      }}
    >
      <div className="feature-copy" key={index}>
        <span className="feature-label">{item.label}</span>
        <h2>{item.title}</h2>
        <p>{item.text}</p>
        <Link to={model ? `/models/${model.slug}` : "/docs/quick-access"}>
          查看模型详情 <ArrowUpRight size={16} />
        </Link>
      </div>
      <div className="feature-art" aria-hidden="true">
        <div className="feature-orbit" />
        <div className="floating-tile tile-back">
          <Layers3 size={38} />
        </div>
        <div className="floating-tile tile-middle">
          <Sparkles size={38} />
        </div>
        <div className="floating-tile tile-front">
          <Icon size={38} />
        </div>
      </div>
      <div className="feature-controls">
        <div className="feature-dots">
          {picks.map((entry, i) => (
            <button
              type="button"
              key={entry.match}
              aria-label={`查看${entry.label}`}
              aria-pressed={index === i}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
        <div className="feature-arrows">
          <button
            type="button"
            aria-label="上一个精选模型"
            onClick={() =>
              setIndex((i) => (i + picks.length - 1) % picks.length)
            }
          >
            <ChevronLeft size={17} />
          </button>
          <button
            type="button"
            aria-label="下一个精选模型"
            onClick={() => setIndex((i) => (i + 1) % picks.length)}
          >
            <ChevronRight size={17} />
          </button>
        </div>
      </div>
    </section>
  );
}
