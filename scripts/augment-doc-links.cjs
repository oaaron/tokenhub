// Add source-derived related links without regenerating editorial article content.
const fs = require("fs"),
  acorn = require("acorn");
const entries = JSON.parse(fs.readFileSync("/tmp/tokenhub-doc-chunks.json"));
const parse = (s) => acorn.parse(s, { ecmaVersion: "latest" });
function walk(n, f) {
  if (!n || typeof n !== "object") return;
  f(n);
  for (const [k, v] of Object.entries(n))
    if (k !== "start" && k !== "end") {
      if (Array.isArray(v)) v.forEach((x) => walk(x, f));
      else if (v && typeof v === "object") walk(v, f);
    }
}
function val(n) {
  if (!n) return;
  if (n.type === "Literal") return n.value;
  if (n.type === "TemplateLiteral" && !n.expressions.length)
    return n.quasis[0].value.cooked;
  if (n.type === "ArrayExpression") return n.elements.map(val);
  if (n.type === "ObjectExpression")
    return Object.fromEntries(
      n.properties
        .filter((x) => x.type === "Property")
        .map((p) => [p.key.name || p.key.value, val(p.value)]),
    );
}
const modules = {},
  texts = {},
  pages = {};
for (const [id, name] of entries) {
  const ast = parse(fs.readFileSync(`/tmp/tokenhub-doc-${id}.js`, "utf8"));
  let main;
  walk(ast, (n) => {
    if (
      n.type === "Property" &&
      n.value?.type === "FunctionExpression" &&
      /^\d+$/.test(String(n.key.value))
    ) {
      if (!main) main = n.value;
      modules[n.key.value] = n.value;
      walk(n.value, (x) => {
        if (
          x.type === "ArrayExpression" &&
          x.elements[0]?.type === "ObjectExpression"
        ) {
          const a = val(x);
          if (a?.[0]?.value !== undefined && a[0]?.paraId !== undefined)
            texts[n.key.value] = a;
        }
      });
    }
  });
  if (name?.startsWith("docs__"))
    pages[
      name
        .replaceAll("__", "/")
        .replace(/^docs\//, "")
        .replace(/\.md$/, "")
        .replace(/\/index$/, "")
    ] = main;
}
const docs = JSON.parse(fs.readFileSync("src/content/docs.json"));
const slugs = new Set(docs.map((d) => d.slug));
function mapping(href, slug) {
  if (!href || typeof href !== "string") return null;
  if (href.startsWith("#")) {
    const doc = docs.find((d) => d.slug === slug);
    return doc?.sections.some((s) => s.id === decodeURIComponent(href.slice(1)))
      ? "/docs/" + slug + href
      : null;
  }
  if (/experience|playground|(?:^|\/)chat(?:[/?#]|$)/i.test(href)) return null;
  let u;
  try {
    u = new URL(href, "https://maas.antdigital.com/dt-maas-docs/" + slug);
  } catch {
    return null;
  }
  if (u.hostname === "maas.antdigital.com") {
    if (u.pathname.startsWith("/models")) return "/models" + u.search;
    let path = u.pathname
      .replace(/^\/(?:dt-maas-docs|docs)\//, "")
      .replace(/\.(?:md|html)$/, "")
      .replace(/\/index$/, "")
      .replace(/\/$/, "")
      .replace(/^\//, "");
    if (slugs.has(path)) {
      const target = docs.find((d) => d.slug === path);
      const hash =
        u.hash &&
        target.sections.some(
          (s) => s.id === decodeURIComponent(u.hash.slice(1)),
        )
          ? u.hash
          : "";
      return "/docs/" + path + hash;
    }
    if (u.pathname.startsWith("/console"))
      return "/service-status?service=account";
    if (u.pathname === "/") return "/";
    if (u.pathname === "/dt-maas-docs" || u.pathname === "/docs")
      return "/docs/intro";
    if (
      /login|register|billing|order|account|workorder|token-plan/.test(
        u.pathname,
      )
    )
      return "/service-status?service=account";
  }
  if (
    /admin\.antchain|console\.|sofastack|signin|login|passport/.test(u.hostname)
  )
    return "/service-status?service=account";
  if (/^https?:$/.test(u.protocol)) return u.href;
  return null;
}
let sourceLinks = 0,
  links = 0,
  images = 0;
const unknown = [];
for (const doc of docs) {
  const module = pages[doc.slug],
    bindings = {};
  walk(module, (n) => {
    if (
      n.type === "VariableDeclarator" &&
      n.init?.type === "CallExpression" &&
      n.init.arguments[0]?.type === "Literal"
    )
      bindings[n.id.name] = n.init.arguments[0].value;
  });
  function resolve(n) {
    if (!n) return "";
    const v = val(n);
    if (typeof v === "string" || typeof v === "number") return String(v);
    if (n.type === "ArrayExpression") return n.elements.map(resolve).join("");
    if (n.type === "MemberExpression" && n.property.name === "value") {
      const idx = n.object;
      if (
        idx.type === "MemberExpression" &&
        idx.object.type === "MemberExpression" &&
        idx.object.property.name === "texts"
      )
        return (
          texts[bindings[idx.object.object.name]]?.[val(idx.property)]?.value ||
          ""
        );
    }
    if (
      n.type === "CallExpression" &&
      n.arguments[1]?.type === "ObjectExpression"
    ) {
      const p = Object.fromEntries(
        n.arguments[1].properties
          .filter((x) => x.type === "Property")
          .map((x) => [x.key.name || x.key.value, x.value]),
      );
      return resolve(p.children);
    }
    return "";
  }
  let main;
  walk(module, (n) => {
    if (n.type === "FunctionDeclaration" && !main) main = n;
  });
  const seen = new Set(),
    found = [];
  const illustrations = [];
  let currentSectionId = doc.sections[0]?.id;
  walk(main, (n) => {
    if (
      n.type !== "CallExpression" ||
      n.arguments[1]?.type !== "ObjectExpression"
    )
      return;
    const p = Object.fromEntries(
      n.arguments[1].properties
        .filter((x) => x.type === "Property")
        .map((x) => [x.key.name || x.key.value, x.value]),
    );
    const tag = val(n.arguments[0]);
    if (typeof tag === "string" && /^h[1-6]$/.test(tag))
      currentSectionId = val(p.id) || currentSectionId;
    const href = val(p.href) || val(p.to);
    if (href) {
      const label = resolve(p.children) || val(p.title) || val(p.label) || "";
      if (!label.trim()) return;
      sourceLinks++;
      const to = mapping(href, doc.slug);
      const key = label.trim() + "|" + to;
      if (to && !seen.has(key)) {
        seen.add(key);
        found.push({ label: label.trim(), to });
      }
    }
    const src = val(p.src);
    if (
      src &&
      /\.(png|jpe?g|webp|svg)|alipayobjects\.com|afts\/img/i.test(src)
    ) {
      const width = Number(val(p.width)),
        height = Number(val(p.height));
      if (width > 0 && height > 0) {
        illustrations.push({
          alt: val(p.alt) || "",
          ratio: width / height,
          sourceUrl: src,
        });
        images++;
      } else
        unknown.push({
          slug: doc.slug,
          alt: val(p.alt) || "",
          sourceUrl: src,
          sectionId: currentSectionId,
        });
    }
  });
  doc.links = found;
  links += found.length;
  if (illustrations.length) doc.illustrations = illustrations;
}
fs.writeFileSync("src/content/docs.json", JSON.stringify(docs, null, 2) + "\n");
fs.writeFileSync(
  "/tmp/tokenhub-source-image-dimensions-unknown.json",
  JSON.stringify(unknown, null, 2),
);
console.log(
  JSON.stringify(
    {
      articles: docs.length,
      sourceLinks,
      links,
      illustrations: images,
      omittedImagesUnknownRatio: unknown.length,
    },
    null,
    2,
  ),
);
