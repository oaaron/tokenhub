import { useState, useEffect, useRef } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "../../design-system";
export function SectionHeading({ index, title, english, description }) {
  return (
    <div className="section-heading">
      <div className="section-title">
        <span className="section-index">{index}</span>
        <h2>
          {title}
          <span>{english}</span>
        </h2>
      </div>
      {description && <p>{description}</p>}
    </div>
  );
}
export function Tag({ children, tone = "neutral" }) {
  return <span className={`preview-tag tone-${tone}`}>{children}</span>;
}
export function CopyButton({ text, label = "复制", size = "sm" }) {
  const [status, setStatus] = useState("idle");
  const timer = useRef();
  useEffect(() => () => clearTimeout(timer.current), []);
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus("idle"), 2500);
  }
  return (
    <>
      <Button
        size={size}
        variant="ghost"
        icon={status === "copied" ? Check : Copy}
        onClick={copy}
        aria-label={`${label} ${text}`}
      >
        {status === "copied" ? "已复制" : label}
      </Button>
      <span className="sr-only" role="status">
        {status === "failed"
          ? "复制失败，请手动选择内容复制。"
          : status === "copied"
            ? "已复制到剪贴板"
            : ""}
      </span>
      {status === "failed" && <span className="ds-error">请手动复制</span>}
    </>
  );
}
