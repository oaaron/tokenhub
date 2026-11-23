import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, X } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import notices from "../../content/notices.json";
import "../../styles/announcement.css";
const STORAGE_KEY = "tokenhub:announcement:v2:dismissed";
export default function SiteAnnouncement() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [dismissed, setDismissed] = useState(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      return false;
    }
  });
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    if (dismissed || paused || reducedMotion || notices.length < 2) return;
    const timer = setInterval(
      () => setIndex((i) => (i + 1) % notices.length),
      3500,
    );
    return () => clearInterval(timer);
  }, [dismissed, paused, reducedMotion]);
  if (dismissed || !notices.length) return null;
  function dismiss() {
    setDismissed(true);
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* Closing works even when storage is unavailable. */
    }
  }
  const notice = notices[index];
  return (
    <aside
      className="site-announcement th-announcement"
      aria-label="站点公告"
      aria-roledescription="轮播"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setPaused(false);
      }}
    >
      <div className="th-announcement-content">
        <Sparkles
          size={18}
          className="th-announcement-icon"
          aria-hidden="true"
        />
        <p>
          <span>{notice.text}</span>{" "}
          <Link to={notice.to}>
            {notice.action}
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </p>
      </div>
      {notices.length > 1 && (
        <div className="th-announcement-dots" aria-label="公告切换">
          {notices.map((item, i) => (
            <button
              type="button"
              key={item.to}
              aria-label={`第 ${i + 1} 条公告：${item.action}`}
              aria-pressed={index === i}
              onClick={() => setIndex(i)}
            >
              <span />
            </button>
          ))}
        </div>
      )}
      <button
        className="th-announcement-close"
        type="button"
        aria-label="关闭公告"
        onClick={dismiss}
      >
        <X size={19} />
      </button>
    </aside>
  );
}
