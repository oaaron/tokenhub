import { useState, useEffect, useRef } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "../../design-system";
export function CodeExample({ examples, label = "代码示例" }) {
  const [selected, setSelected] = useState(0);
  const [feedback, setFeedback] = useState("");
  const timer = useRef();
  useEffect(() => () => clearTimeout(timer.current), []);
  const current = examples[selected] || examples[0];
  if (!current) return null;
  async function copy() {
    try {
      await navigator.clipboard.writeText(current.code);
      setFeedback("已复制");
    } catch {
      setFeedback("复制失败，请手动复制");
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setFeedback(""), 2500);
  }
  return (
    <div className="code-example">
      <div className="code-toolbar">
        <div role="tablist" aria-label={label}>
          {examples.map((example, index) => (
            <button
              type="button"
              key={`${example.language}-${index}`}
              role="tab"
              aria-selected={index === selected}
              onClick={() => {
                setSelected(index);
                setFeedback("");
              }}
            >
              {example.language}
            </button>
          ))}
        </div>
        <Button
          size="sm"
          variant="ghost"
          icon={feedback === "已复制" ? Check : Copy}
          onClick={copy}
          aria-label={`复制当前 ${current.language} 代码`}
        >
          {feedback === "已复制" ? "已复制" : "复制"}
        </Button>
      </div>
      <pre role="tabpanel" aria-label={`${current.language} 示例`}>
        <code>{current.code}</code>
      </pre>
      <span className="code-feedback" role="status">
        {feedback}
      </span>
    </div>
  );
}
