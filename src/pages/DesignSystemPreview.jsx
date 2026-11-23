import BrandMark from "../components/brand/BrandMark";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Box,
  Check,
  ChevronRight,
  BookOpen,
  Menu,
  Moon,
  Sun,
  X,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Button,
  ThemeProvider,
  useMediaQuery,
  breakpoints,
} from "../design-system";
import { sections } from "./design-system/data";
import Overview from "./design-system/Overview";
import Foundations from "./design-system/Foundations";
import ComponentGallery from "./design-system/ComponentGallery";
import GatewayExample from "./design-system/GatewayExample";
import "./design-system/preview.css";
export default function DesignSystemPreview() {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("velink-theme") === "dark" ? "dark" : "light";
    } catch {
      return "light";
    }
  });
  const [active, setActive] = useState("overview");
  const [menuOpen, setMenuOpen] = useState(false);
  const mobile = useMediaQuery(`(max-width: ${breakpoints.tablet})`);
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    try {
      localStorage.setItem("velink-theme", theme);
    } catch {
      /* Theme remains usable without storage. */
    }
  }, [theme]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-15% 0px -55% 0px", threshold: 0 },
    );
    sections.forEach(({ id }) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!menuOpen) return;
    const close = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [menuOpen]);
  return (
    <ThemeProvider theme={theme} className="preview-app">
      <a href="#main-content" className="skip-link">
        跳到主要内容
      </a>
      <header className="site-header">
        <a href="#overview" className="brand" aria-label="Velink 设计系统首页">
          <span className="brand-symbol">
            <BrandMark size={30} />
          </span>
          <span>
            Ve<span className="brand-light">link</span>
            <span className="brand-dot" />
          </span>
        </a>
        <span className="header-separator" />
        <span className="header-product">Design System</span>
        <nav className="header-nav" aria-label="页面导航">
          <a href="#overview" className="current">
            设计系统
          </a>
          <a href="#patterns">
            应用示例 <ArrowUpRight size={12} />
          </a>
          <a href="#usage">
            使用指南 <ArrowUpRight size={12} />
          </a>
        </nav>
        <div className="header-actions">
          <span className="version-pill">
            <i /> v1.0.0
          </span>
          <Button
            variant="ghost"
            size="sm"
            icon={theme === "light" ? Moon : Sun}
            aria-label={theme === "light" ? "切换深色主题" : "切换浅色主题"}
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          />
          <Button
            className="mobile-menu-button"
            variant="ghost"
            size="sm"
            icon={menuOpen ? X : Menu}
            aria-label={menuOpen ? "收起导航" : "展开导航"}
            aria-expanded={menuOpen}
            aria-controls="sidebar-navigation"
            onClick={() => setMenuOpen(!menuOpen)}
          />
        </div>
      </header>
      {mobile && menuOpen && (
        <button
          className="sidebar-backdrop"
          aria-label="关闭导航"
          onClick={() => setMenuOpen(false)}
        />
      )}
      <aside
        className={`sidebar ${mobile && menuOpen ? "is-open" : ""}`}
        id="sidebar-navigation"
      >
        <div className="sidebar-intro">
          <span className="sidebar-kicker">基础规范</span>
          <h2>设计的共同语言</h2>
          <p>清晰 · 一致 · 可信赖</p>
        </div>
        <nav aria-label="设计系统分区">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={active === section.id ? "active" : ""}
              aria-current={active === section.id ? "location" : undefined}
              onClick={() => {
                setActive(section.id);
                setMenuOpen(false);
              }}
            >
              <span className="nav-number">{section.number}</span>
              <span>{section.label}</span>
              <ChevronRight size={13} />
            </a>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-note">
            <Box size={20} />
            <strong>从容构建产品。</strong>
            <p>
              从一个组件，
              <br />
              到完整的产品体验。
            </p>
            <a href="#usage" onClick={() => setMenuOpen(false)}>
              开始使用 <ArrowUpRight size={13} />
            </a>
          </div>
          <span className="sidebar-footnote">
            <span /> REACT + TAILWIND CSS
          </span>
        </div>
      </aside>
      <main className="preview-main" id="main-content">
        <div className="page-breadcrumb">
          <span>Velink</span>
          <ChevronRight size={12} />
          <span>设计系统</span>
          <span className="breadcrumb-end">
            <Check size={12} /> 为一致体验而设计
          </span>
        </div>
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Overview />
          <Foundations theme={theme} />
          <ComponentGallery />
          <GatewayExample />
        </motion.div>
        <section className="usage-section section-anchor" id="usage">
          <div>
            <span className="intro-eyebrow">统一规范，灵活复用</span>
            <h2>设计一致，开发更从容。</h2>
            <p>
              所有组件与 Tokens 从统一入口导出。
              <br />
              页面只负责组合，设计语言自成体系。
            </p>
            <a href="#components">
              回到组件 <ArrowUpRight size={14} />
            </a>
          </div>
          <div className="usage-code">
            <div>
              <span />
              <span />
              <span />
              <small>App.jsx</small>
            </div>
            <pre>
              <code>
                <span className="code-purple">import</span> DesignSystemPreview
                {"\n"} <span className="code-purple">from</span>{" "}
                <span className="code-green">
                  './pages/DesignSystemPreview'
                </span>
                {"\n\n"}
                <span className="code-purple">
                  export default function
                </span>{" "}
                App() {"{"}
                {"\n"} <span className="code-purple">return</span>{" "}
                {"<DesignSystemPreview />"}
                {"\n"}
                {"}"}
              </code>
            </pre>
          </div>
        </section>
        <footer className="page-footer">
          <span>
            <BrandMark size={20} /> Velink <small>设计系统</small>
          </span>
          <p>清晰的设计，连接每一个可能。</p>
          <a href="#usage" aria-label="查看使用指南">
            <BookOpen size={16} />
            <ArrowUpRight size={12} />
          </a>
        </footer>
      </main>
    </ThemeProvider>
  );
}
