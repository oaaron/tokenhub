import { LinkButton } from "../../components/site/LinkButton";
export default function NotFoundPage() {
  return (
    <div className="site-container site-empty standard-page">
      <div className="eyebrow">404</div>
      <h1>这个页面暂时不存在。</h1>
      <p>请检查地址，或从模型市场与开发者文档继续浏览。</p>
      <div className="inline-actions">
        <LinkButton to="/">返回首页</LinkButton>
        <LinkButton to="/docs/intro" variant="secondary">
          开发者文档
        </LinkButton>
      </div>
    </div>
  );
}
