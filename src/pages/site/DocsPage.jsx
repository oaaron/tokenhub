import { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import {
  BookOpen,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  List,
  Search,
} from "lucide-react";
import { Button, Input } from "../../design-system";
import {
  docs,
  docGroups,
  getArticle,
  configureCode,
  configureText,
} from "../../content/docs.js";
import { CodeExample } from "../../components/site/CodeExample";
import { siteConfig } from "../../config/site";
import NotFoundPage from "./NotFoundPage";
export default function DocsPage() {
  const params = useParams();
  const article = getArticle(params["*"] || "intro");
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [menu, setMenu] = useState(false);
  const [active, setActive] = useState("");
  useEffect(() => {
    if (!article) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          )[0];
        if (first) setActive(first.target.id);
      },
      { rootMargin: "-100px 0px -60% 0px" },
    );
    article.sections.forEach((section) => {
      const node = document.getElementById(section.id);
      if (node) observer.observe(node);
    });
    return () => observer.disconnect();
  }, [article]);
  if (!article) return <NotFoundPage />;
  const index = docs.indexOf(article);
  const previous = docs[index - 1],
    next = docs[index + 1];
  const codeExamples = (examples) =>
    examples.map((example) => ({
      ...example,
      code: configureCode(example.code, example.language),
    }));
  return (
    <div className="site-container docs-shell">
      <div className="docs-mobile-bar">
        <Button
          variant="secondary"
          size="sm"
          icon={BookOpen}
          aria-expanded={menu}
          onClick={() => setMenu(!menu)}
        >
          文档目录 <ChevronDown size={13} />
        </Button>
        <span>{article.title}</span>
      </div>
      <aside
        className={`docs-navigation ${menu ? "is-open" : ""}`}
        aria-label="文档目录"
      >
        <div className="docs-nav-title">
          <BookOpen size={17} />
          <strong>开发者文档</strong>
        </div>
        <Input
          aria-label="搜索文档"
          icon={Search}
          value={query}
          placeholder="搜索文章…"
          onChange={(e) => setQuery(e.target.value)}
        />
        <nav>
          {docGroups.map((group) => {
            const matches = group.articles.filter((item) =>
              item.title.toLowerCase().includes(query.toLowerCase()),
            );
            return matches.length ? (
              <details key={group.title} open>
                <summary>{group.title}</summary>
                <div>
                  {matches.map((item) => (
                    <Link
                      key={item.slug}
                      className={item.slug === article.slug ? "is-active" : ""}
                      aria-current={
                        item.slug === article.slug ? "page" : undefined
                      }
                      to={`/docs/${item.slug}`}
                      onClick={() => {
                        setMenu(false);
                        setQuery("");
                      }}
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              </details>
            ) : null;
          })}
        </nav>
        {!docs.some((item) =>
          item.title.toLowerCase().includes(query.toLowerCase()),
        ) && <p className="docs-search-empty">未找到匹配的文档。</p>}
      </aside>
      <article className="docs-article" key={location.pathname}>
        <div className="docs-breadcrumb">
          开发者文档 <ChevronRight size={12} />
          {article.group}
        </div>
        <h1>{article.title}</h1>
        {!siteConfig.apiBaseUrl &&
          article.sections.some(
            (section) => section.codeExamples?.length > 0,
          ) && (
            <div className="notice-box">
              服务地址尚未配置。代码中的 TOKENHUB_API_ROOT_URL（不含
              /v1）、TOKENHUB_API_BASE_URL（含 /v1）及 TOKENHUB_API_KEY
              需在运行环境中设置，JSON / TOML 中的 YOUR_TOKENHUB_HOST
              需手动替换，切勿将真实密钥写入网页。
            </div>
          )}
        {!article.slug.startsWith("updates/") &&
          !article.slug.startsWith("about/") && (
            <div className="notice-box">
              TokenHub
              账户、交易与管理接口尚未开放。本文介绍配置方法与技术流程，实际可用功能、模型、计费规则和权限以服务开通配置为准。
            </div>
          )}
        <details className="inline-toc">
          <summary>
            <List size={14} /> 本页目录
          </summary>
          {article.sections
            .filter((s) => s.level <= 2)
            .map((section) => (
              <a key={section.id} href={`#${encodeURIComponent(section.id)}`}>
                {section.title}
              </a>
            ))}
        </details>
        {article.sections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            className={`doc-section doc-level-${section.level}`}
          >
            {section.level > 1 &&
              (section.level === 2 ? (
                <h2>
                  {section.title}
                  <a
                    href={`#${encodeURIComponent(section.id)}`}
                    aria-label={`链接到 ${section.title}`}
                  >
                    #
                  </a>
                </h2>
              ) : (
                <h3>
                  {section.title}
                  <a
                    href={`#${encodeURIComponent(section.id)}`}
                    aria-label={`链接到 ${section.title}`}
                  >
                    #
                  </a>
                </h3>
              ))}
            {(section.paragraphs || []).map((paragraph, i) => (
              <p key={i}>{configureText(paragraph)}</p>
            ))}
            {(article.illustrations || [])
              .filter((image) => image.sectionId === section.id)
              .map((image, i) => (
                <figure className="doc-illustration" key={i}>
                  <div
                    style={{ aspectRatio: `${image.width} / ${image.height}` }}
                    role="img"
                    aria-label={`${image.alt || "技术示意图"}：灰色占位图`}
                  >
                    <BookOpen size={22} />
                    <span>{image.alt || "技术示意图"}</span>
                  </div>
                  <figcaption>{image.alt || "操作示意图"}</figcaption>
                </figure>
              ))}
            {(section.tables || []).map((table, i) => (
              <div className="doc-table" key={i}>
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        {table.headers.map((cell, j) => (
                          <th key={j}>{configureText(cell)}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {table.rows.map((row, j) => (
                        <tr key={j}>
                          {row.map((cell, k) => (
                            <td key={k}>{configureText(cell)}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
            {section.codeExamples?.length > 0 && (
              <CodeExample
                key={section.id}
                label={`${section.title} 代码语言`}
                examples={codeExamples(section.codeExamples)}
              />
            )}
          </section>
        ))}
        {article.links?.length > 0 && (
          <section className="related-doc-links">
            <h2>相关入口</h2>
            {article.links.map((link, i) =>
              /^https?:/.test(link.to) ? (
                <a key={i} href={link.to} target="_blank" rel="noreferrer">
                  {link.label} ↗
                </a>
              ) : (
                <Link key={i} to={link.to}>
                  {link.label} <ChevronRight size={12} />
                </Link>
              ),
            )}
          </section>
        )}
        <nav className="docs-pagination" aria-label="章节导航">
          {previous ? (
            <Link to={`/docs/${previous.slug}`}>
              <small>
                <ChevronLeft size={12} />
                上一篇
              </small>
              <strong>{previous.title}</strong>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link to={`/docs/${next.slug}`}>
              <small>
                下一篇
                <ChevronRight size={12} />
              </small>
              <strong>{next.title}</strong>
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </article>
      <aside className="docs-toc" aria-label="本页目录">
        <strong>本页目录</strong>
        <nav>
          {article.sections
            .filter((s) => s.level <= 2)
            .map((section) => (
              <a
                key={section.id}
                href={`#${encodeURIComponent(section.id)}`}
                className={active === section.id ? "is-active" : ""}
              >
                {section.title}
              </a>
            ))}
        </nav>
        <Link className="docs-help-link" to="/service-status?service=contact">
          需要帮助？
          <ChevronRight size={12} />
        </Link>
      </aside>
    </div>
  );
}
