const fs = require("fs"),
  acorn = require("acorn");
const entries = JSON.parse(fs.readFileSync("/tmp/tokenhub-doc-chunks.json"));
const parse = (s) => acorn.parse(s, { ecmaVersion: "latest" });
function walk(n, f) {
  if (!n || typeof n !== "object") return;
  f(n);
  for (const [_k, v] of Object.entries(n))
    if (_k !== "start" && _k !== "end") {
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
  if (n.type === "UnaryExpression" && n.operator === "-")
    return -val(n.argument);
}
const mods = {},
  texts = {};
for (const [id] of entries) {
  const ast = parse(fs.readFileSync(`/tmp/tokenhub-doc-${id}.js`, "utf8"));
  walk(ast, (n) => {
    if (
      n.type === "Property" &&
      n.value?.type === "FunctionExpression" &&
      /^\d+$/.test(String(n.key.value))
    ) {
      mods[n.key.value] = n.value;
      walk(n.value, (x) => {
        if (
          x.type === "ArrayExpression" &&
          x.elements.length &&
          x.elements[0]?.type === "ObjectExpression"
        ) {
          const a = val(x);
          if (a[0]?.value !== undefined && a[0]?.paraId !== undefined)
            texts[n.key.value] = a;
        }
      });
    }
  });
}
const mast = parse(fs.readFileSync("/tmp/tokenhub-docs.js", "utf8")),
  vars = {};
walk(mast, (n) => {
  if (n.type === "VariableDeclarator" && n.id.type === "Identifier")
    vars[n.id.name] = n.init;
});
const fronts = {};
walk(mast, (n) => {
  if (n.type === "NewExpression" && n.callee.name === "Proxy") {
    const x = val(n.arguments[0]);
    if (x?.filename && !x.filename.includes(".en-US")) fronts[x.filename] = x;
  }
});
function extract(module) {
  const bindings = {};
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
    if (n.type === "CallExpression") {
      if (val(n.arguments[0]) === "br") return "\n";
      const p = n.arguments[1];
      if (p?.type === "ObjectExpression") {
        const props = Object.fromEntries(
          p.properties
            .filter((x) => x.type === "Property")
            .map((x) => [x.key.name || x.key.value, x.value]),
        );
        return resolve(props.children);
      }
    }
    return "";
  }
  const blocks = [];
  let main;
  walk(module, (n) => {
    if (n.type === "FunctionDeclaration" && !main) main = n;
  });
  if (!main) return blocks;
  function visit(n) {
    if (!n || typeof n !== "object") return;
    if (
      n.type === "CallExpression" &&
      n.arguments[1]?.type === "ObjectExpression"
    ) {
      const tag = val(n.arguments[0]),
        props = Object.fromEntries(
          n.arguments[1].properties
            .filter((x) => x.type === "Property")
            .map((x) => [x.key.name || x.key.value, x.value]),
        );
      if (typeof tag === "string" && /^h[1-6]$/.test(tag)) {
        blocks.push({
          kind: "heading",
          level: +tag[1],
          id: val(props.id),
          text: resolve(props.children),
        });
        return;
      }
      if (
        tag === "table" ||
        (n.arguments[0]?.type === "MemberExpression" &&
          bindings[n.arguments[0].object.name] === 75968)
      ) {
        const rows = [];
        walk(n, (x) => {
          if (x.type === "CallExpression" && val(x.arguments[0]) === "tr") {
            const cells = [];
            walk(x.arguments[1], (y) => {
              if (
                y.type === "CallExpression" &&
                ["td", "th"].includes(val(y.arguments[0]))
              )
                cells.push(resolve(y));
            });
            rows.push(cells);
          }
        });
        blocks.push({ kind: "table", rows });
        return;
      }
      if (tag === "p" || tag === "li") {
        const text = resolve(props.children);
        if (text) blocks.push({ kind: "paragraph", text });
        return;
      }
      if (props.lang) {
        const text = resolve(props.children);
        if (text)
          blocks.push({ kind: "code", language: val(props.lang), text });
        return;
      }
      if (
        typeof tag !== "string" &&
        props.children &&
        (props.children.type === "MemberExpression" ||
          (props.children.type === "ArrayExpression" &&
            props.children.elements.every(
              (x) => x?.type === "MemberExpression" || x?.type === "Literal",
            )))
      ) {
        const text = resolve(props.children);
        if (text) {
          blocks.push({ kind: "paragraph", text });
          return;
        }
      }
      if (props.title && props.desc) {
        blocks.push({
          kind: "paragraph",
          text: resolve(props.title) + "：" + resolve(props.desc),
        });
        return;
      }
    }
    for (const [_k, v] of Object.entries(n)) {
      if (Array.isArray(v)) v.forEach(visit);
      else if (v && typeof v === "object") visit(v);
    }
  }
  visit(main);
  return blocks;
}
const output = [];
for (const [id, name] of entries) {
  if (!name?.startsWith("docs__") || name.includes("model-experience"))
    continue;
  const filename = name.replaceAll("__", "/");
  const f = fronts[filename];
  const ast = parse(fs.readFileSync(`/tmp/tokenhub-doc-${id}.js`, "utf8"));
  let first;
  walk(ast, (n) => {
    if (
      !first &&
      n.type === "Property" &&
      n.value?.type === "FunctionExpression" &&
      /^\d+$/.test(String(n.key.value))
    )
      first = n.value;
  });
  const slug = filename
    .replace(/^docs\//, "")
    .replace(/\.md$/, "")
    .replace(/\/index$/, "");
  output.push({
    slug,
    title: f?.title || slug,
    group: f?.group?.title || "文档",
    groupOrder: f?.group?.order || 9,
    order: f?.order || 0,
    sourceUrl: "https://maas.antdigital.com/dt-maas-docs/" + slug,
    blocks: extract(first),
  });
}
fs.writeFileSync(
  "/tmp/tokenhub-extracted.json",
  JSON.stringify(output, null, 2),
);
console.log(
  output.map((d) => [
    d.slug,
    d.title,
    d.blocks.length,
    d.blocks.filter((b) => b.kind === "table").length,
    d.blocks.filter((b) => b.kind === "code").length,
  ]),
);
