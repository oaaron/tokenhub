import { useSearchParams } from "react-router-dom";
import { CircleDashed, ArrowRight } from "lucide-react";
import { Card } from "../../design-system";
import { siteConfig } from "../../config/site";
import { LinkButton } from "../../components/site/LinkButton";
const labels = {
  account: "账户与控制台",
  purchase: "套餐购买",
  contact: "联系服务",
  privacy: "隐私政策",
  terms: "服务条款",
};
export default function ServiceStatusPage() {
  const [params] = useSearchParams();
  const service = params.get("service") || "account";
  return (
    <div className="site-container service-page">
      <Card>
        <span className="service-icon">
          <CircleDashed size={28} />
        </span>
        <h1>{labels[service] || "服务入口"}尚未开放</h1>
        <p>
          {service === "purchase"
            ? "当前尚未发布正式报价和购买入口。未创建订单，也未收取任何费用。"
            : "该服务的正式入口尚未配置。你可以继续查看模型能力、套餐说明与开发文档。"}
        </p>
        {params.get("plan") && (
          <div className="selected-plan-status">
            所选方案：<code>{params.get("plan")}</code> · 月付
          </div>
        )}
        <div className="inline-actions">
          <LinkButton to="/models">
            浏览模型 <ArrowRight size={16} />
          </LinkButton>
          <LinkButton to="/docs/quick-access" variant="secondary">
            查看接入说明
          </LinkButton>
          {siteConfig.contactUrl && (
            <LinkButton to={siteConfig.contactUrl} variant="ghost">
              联系 TokenHub
            </LinkButton>
          )}
        </div>
      </Card>
    </div>
  );
}
