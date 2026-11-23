import { apiExamples } from "./examples";
import { configureCode } from "./docs.js";
export function modelExampleGroups(model) {
  let source = {};
  try {
    source = JSON.parse(model.extInfo || "{}").exampleCodes || {};
  } catch {
    /* Preserve an explicit missing-example state. */
  }
  const groups = Object.entries(source)
    .filter(([, items]) => Array.isArray(items))
    .map(([protocol, items]) => {
      const issues = [];
      return {
        protocol,
        issues,
        examples: items
          .filter((item) => item.code)
          .map((item, index) => {
            let language = item.name || "text";
            let raw = item.code
              .replaceAll("\u200b", "")
              .replace(/^mport os$/gm, "import os");
            if (/^\s*curl\b/.test(raw)) language = "curl";
            else if (/^\s*(?:import |from \w+ import )/.test(raw))
              language = "python";
            const unavailable = (reason) => {
              issues.push({ protocol, language, reason });
              return null;
            };
            // These source fragments are incomplete; reconstructing their missing calls
            // or operation paths would invent an API contract.
            if (
              /sample_rate=16000/.test(raw) &&
              !/recognition\s*=\s*Recognition\(/.test(raw)
            )
              return unavailable(
                "原站实时识别示例缺少完整 Recognition 调用，暂不提供可执行代码。",
              );
            if (/https?:\/\/maas\.antdigital\.com\/v1(?:[\s"']|$)/.test(raw))
              return unavailable(
                "原站请求地址缺少操作路径，需服务方确认后提供。",
              );
            if (/wss?:\/\/maas-api\.antdigital\.com/.test(raw))
              return unavailable(
                "原站 WebSocket 地址尚未映射为 TokenHub 服务配置。",
              );
            if (/python/i.test(language)) {
              // Some source snippets share a two-space presentation indent.
              const nonempty = raw.split("\n").filter((line) => line.trim());
              const indent = Math.min(
                ...nonempty.map((line) => line.match(/^ */)[0].length),
              );
              if (indent > 0)
                raw = raw
                  .split("\n")
                  .map((line) => line.slice(indent))
                  .join("\n");
            }
            let code = raw
              .replaceAll("https://maas-api.antdigital.com", "__API_BASE_URL__")
              .replaceAll("http://maas-api.antdigital.com", "__API_BASE_URL__")
              .replaceAll("ANT_MAAS_API_KEY", "TOKENHUB_API_KEY")
              .replaceAll("MAAS_API_KEY", "TOKENHUB_API_KEY");
            code = code
              .replace(
                /(\bmodel\s*=\s*)["'][^"']+["']/g,
                (_, prefix) => prefix + JSON.stringify(model.name),
              )
              .replace(
                /("model"\s*:\s*)"[^"]+"/g,
                (_, prefix) => prefix + JSON.stringify(model.name),
              );
            if (/python/i.test(language)) {
              code = code
                .replace(
                  /os\.environ\.get\(\s*["']TOKENHUB_API_KEY["']\s*,\s*["']<API_KEY>["']\s*,?\s*\)/g,
                  'os.environ["TOKENHUB_API_KEY"]',
                )
                .replace(
                  /(["'])Bearer (?:YOUR_API_KEY|<[aA][pP][iI]_[kK][eE][yY]>|\$API_KEY)\1/g,
                  '"Bearer " + os.environ["TOKENHUB_API_KEY"]',
                )
                .replace(
                  /(api_key\s*=\s*)(?:["'](?:YOUR_API_KEY|<[aA][pP][iI]_[kK][eE][yY]>)["']|<[aA][pP][iI]_[kK][eE][yY]>)/g,
                  '$1os.environ["TOKENHUB_API_KEY"]',
                );
              if (code.includes("os.environ") && !/^import os\b/m.test(code))
                code = "import os\n" + code;
            } else if (/curl|bash|shell/i.test(language)) {
              code = code
                .replace(
                  /\$API_KEY\b|YOUR_API_KEY|<api_key>/gi,
                  "$TOKENHUB_API_KEY",
                )
                .replace(
                  /'Authorization: Bearer ([^']+)'/g,
                  '"Authorization: Bearer $1"',
                );
              // Repair the source's missing closing quote on a header line only.
              code = code.replace(
                /(-H\s+"Authorization: Bearer \$TOKENHUB_API_KEY)\s+(\\)$/gm,
                '$1" $2',
              );
            } else if (/javascript|node|typescript/i.test(language)) {
              code = code
                .replace(
                  /(["'])Bearer (?:YOUR_API_KEY|<API_KEY>)\1/g,
                  "`Bearer ${process.env.TOKENHUB_API_KEY}`",
                )
                .replace(
                  /(apiKey\s*:\s*)["'](?:YOUR_API_KEY|<API_KEY>)["']/g,
                  "$1process.env.TOKENHUB_API_KEY",
                );
            }
            return {
              language: `${language} · ${item.sectionTitle || `示例 ${index + 1}`}`,
              code: configureCode(code, language),
            };
          })
          .filter(Boolean),
      };
    })
    .filter((group) => group.examples.length || group.issues.length);
  if (groups.length) return groups;
  return model.modelProtocolCompatibility?.openai_chat_completions
    ? [
        {
          protocol: "OpenAI Chat Completions",
          examples: apiExamples(model.name),
        },
      ]
    : [];
}
