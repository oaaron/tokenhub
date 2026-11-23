import { useState, useEffect } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { ArrowUpRight, Layers3, Menu, X, Sun, Moon } from "lucide-react";
import { Button, ThemeProvider } from "../../design-system";
import { navigation, siteConfig } from "../../config/site";
import { LinkButton } from "./LinkButton";
import "../../styles/site.css";
import "../../styles/readability.css";
import SiteAnnouncement from "./SiteAnnouncement";
export function Brand() {
  return (
    <Link className="th-brand" to="/" aria-label="TokenHub 首页">
      <span>
        <Layers3 size={25} />
      </span>
      <strong>
        Token<span>Hub</span>
        <i />
      </strong>
    </Link>
  );
}
function Navigation({ onNavigate }) {
  return navigation.map((item) => (
    <NavLink
      key={item.href}
      to={item.href}
      end={item.href === "/"}
      onClick={onNavigate}
      className={({ isActive }) => (isActive ? "is-active" : "")}
    >
      {item.label}
    </NavLink>
  ));
}
function SiteHeader({ theme, onTheme }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  useEffect(() => {
    if (!open) return;
    const escape = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, [open]);
  return (
    <header className="th-header">
      <div className="site-container header-inner">
        <Brand />
        <nav className="desktop-navigation" aria-label="主导航">
          <Navigation />
        </nav>
        <div className="header-controls">
          <Button
            variant="ghost"
            size="sm"
            icon={theme === "light" ? Moon : Sun}
            aria-label={theme === "light" ? "切换深色主题" : "切换浅色主题"}
            onClick={onTheme}
          />
          <LinkButton
            to={siteConfig.accountUrl || "/service-status?service=account"}
            variant="secondary"
            size="sm"
          >
            控制台 <ArrowUpRight size={14} />
          </LinkButton>
          <Button
            className="th-menu-toggle"
            variant="ghost"
            size="sm"
            icon={open ? X : Menu}
            aria-label={open ? "关闭主导航" : "打开主导航"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen(!open)}
          />
        </div>
      </div>
      {open && (
        <nav
          key={location.pathname}
          className="mobile-navigation"
          id="mobile-navigation"
          aria-label="移动主导航"
        >
          <Navigation onNavigate={() => setOpen(false)} />
        </nav>
      )}
    </header>
  );
}
function SiteFooter() {
  return (
    <footer className="th-footer">
      <div className="site-container footer-grid">
        <div>
          <Brand />
          <p>
            面向 AI 优先时代的智能基础设施。
            <br />
            连接模型、应用与企业。
          </p>
          <span className="footer-status">
            <i /> 为清晰、高效的 AI 接入而构建
          </span>
        </div>
        <div>
          <h3>产品</h3>
          <Link to="/models">模型市场</Link>
          <Link to="/models/compare">模型对比</Link>
          <Link to="/pricing">Token Plan</Link>
        </div>
        <div>
          <h3>开发者</h3>
          <Link to="/docs/intro">文档中心</Link>
          <Link to="/docs/quick-access">快速接入</Link>
          <Link to="/docs/agent-guides/codex">接入智能体</Link>
        </div>
        <div>
          <h3>服务</h3>
          <a href={siteConfig.contactUrl || "/service-status?service=contact"}>
            联系我们
          </a>
          <a href={siteConfig.privacyUrl || "/service-status?service=privacy"}>
            隐私政策
          </a>
          <a href={siteConfig.termsUrl || "/service-status?service=terms"}>
            服务条款
          </a>
        </div>
      </div>
      <div className="site-container footer-bottom">
        <span>
          © {siteConfig.copyright} {siteConfig.subject}
        </span>
        <span>为企业智能应用而构建。</span>
      </div>
    </footer>
  );
}
export default function SiteLayout() {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("tokenhub-theme") === "dark"
        ? "dark"
        : "light";
    } catch {
      return "light";
    }
  });
  const { pathname, hash } = useLocation();
  useEffect(() => {
    try {
      localStorage.setItem("tokenhub-theme", theme);
    } catch {
      /* Browser storage is optional. */
    }
  }, [theme]);
  useEffect(() => {
    if (hash) {
      const timer = setTimeout(
        () =>
          document
            .getElementById(decodeURIComponent(hash.slice(1)))
            ?.scrollIntoView(),
        50,
      );
      return () => clearTimeout(timer);
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return (
    <ThemeProvider theme={theme} className="tokenhub-site">
      <a href="#main" className="th-skip">
        跳到主要内容
      </a>
      <SiteAnnouncement />
      <SiteHeader
        theme={theme}
        onTheme={() => setTheme(theme === "light" ? "dark" : "light")}
      />
      <main id="main">
        <Outlet />
      </main>
      <SiteFooter />
    </ThemeProvider>
  );
}
