// Public browser configuration only. Never place private API keys in VITE_* variables.
const env = import.meta.env;
const safeUrl = (value) => {
  if (!value) return null;
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
};
export const siteConfig = {
  name: "Velink",
  subject: env.VITE_COMPANY_NAME || "Velink",
  apiBaseUrl: safeUrl(env.VITE_API_BASE_URL)?.replace(/\/$/, "") || null,
  apiRootUrl:
    safeUrl(env.VITE_API_ROOT_URL)?.replace(/\/$/, "") ||
    safeUrl(env.VITE_API_BASE_URL)
      ?.replace(/\/v1\/?$/, "")
      .replace(/\/$/, "") ||
    null,
  accountUrl: safeUrl(env.VITE_ACCOUNT_URL),
  purchaseUrl: safeUrl(env.VITE_PURCHASE_URL),
  contactUrl: safeUrl(env.VITE_CONTACT_URL),
  privacyUrl: safeUrl(env.VITE_PRIVACY_URL),
  termsUrl: safeUrl(env.VITE_TERMS_URL),
  copyright: new Date().getFullYear(),
};
export const navigation = [
  { href: "/", label: "首页" },
  { href: "/models", label: "模型市场" },
  { href: "/pricing", label: "Token Plan" },
  { href: "/docs/intro", label: "开发者文档" },
];
// Populate only after commercial approval. Null is deliberately not zero/free.
export const planOffers = Object.fromEntries(
  ["Go", "Build", "Advance", "Scale"].map((id) => [
    id,
    {
      monthlyPrice: null,
      currency: "CNY",
      creditAmount: null,
      purchaseUrl: null,
    },
  ]),
);
export const modelOffers = {}; // Model slug -> { inputPrice, outputPrice, currency, unit }
export function purchaseTarget(plan) {
  const configured = planOffers[plan]?.purchaseUrl || siteConfig.purchaseUrl;
  if (!configured)
    return `/service-status?service=purchase&plan=${encodeURIComponent(plan)}`;
  const url = new URL(configured);
  url.searchParams.set("plan", plan);
  url.searchParams.set("period", "monthly");
  return url.href;
}
