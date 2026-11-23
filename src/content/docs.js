import articles from "./docs.json";
import { siteConfig } from "../config/site";
export const docs = [...articles].sort(
  (a, b) => a.groupOrder - b.groupOrder || a.order - b.order,
);
export const getArticle = (slug) =>
  docs.find((article) => article.slug === slug);
export const docGroups = [...new Set(docs.map((article) => article.group))].map(
  (title) => ({
    title,
    articles: docs.filter((article) => article.group === title),
  }),
);
export function configureCode(code, language = "text", config = siteConfig) {
  const root = config.apiRootUrl || config.apiBaseUrl?.replace(/\/v1\/?$/, "");
  const normalized = code.replaceAll("__API_ROOT_URL__", "__API_BASE_URL__");
  if (root) return normalized.replaceAll("__API_BASE_URL__", root);
  const lang = language.toLowerCase();
  if (["python", "py"].includes(lang)) {
    const result = normalized.replace(
      /(["'])__API_BASE_URL__([^"']*)\1/g,
      (_, quote, path) =>
        `os.environ["VELINK_API_ROOT_URL"].rstrip("/")${path ? ` + ${JSON.stringify(path)}` : ""}`,
    );
    return result !== normalized && !/^import os\b/m.test(result)
      ? `import os\n${result}`
      : result;
  }
  if (["javascript", "js", "typescript", "node.js"].includes(lang))
    return normalized.replace(
      /(["'])__API_BASE_URL__([^"']*)\1/g,
      (_, quote, path) =>
        `process.env.VELINK_API_ROOT_URL.replace(/\\/$/, '')${path ? ` + ${JSON.stringify(path)}` : ""}`,
    );
  if (["bash", "shell", "curl", "sh"].includes(lang))
    return normalized.replace(
      /(["'])__API_BASE_URL__([^"']*)\1|__API_BASE_URL__([^\s"']*)/g,
      (_, quote, path, bare) =>
        `"\${VELINK_API_ROOT_URL}${path ?? bare ?? ""}"`,
    );
  // JSON/TOML do not universally support environment interpolation for URLs.
  // A visibly non-routable template is used until a real project address is configured.
  return normalized.replaceAll(
    "__API_BASE_URL__",
    "https://YOUR_VELINK_HOST",
  );
}
export function configureText(text) {
  return String(text)
    .replaceAll(
      "__API_BASE_URL__/v1",
      siteConfig.apiBaseUrl || "https://YOUR_VELINK_HOST/v1",
    )
    .replaceAll(
      "__API_BASE_URL__",
      siteConfig.apiRootUrl || "https://YOUR_VELINK_HOST",
    )
    .replaceAll("provider.maas", "provider.velink")
    .replaceAll("maas/lingdt", "velink/lingdt");
}
