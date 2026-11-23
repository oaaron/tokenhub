import { createServer } from "vite";
import fs from "node:fs/promises";
const server = await createServer({
  server: { middlewareMode: true },
  appType: "custom",
});
try {
  const { modelExampleGroups } = await server.ssrLoadModule(
    "/src/content/modelExamples.js",
  );
  const { loadModelDetail } = await server.ssrLoadModule(
    "/src/content/modelDetails.js",
  );
  const { models } = await server.ssrLoadModule("/src/content/models.js");
  const docs = JSON.parse(await fs.readFile("src/content/docs.json", "utf8"));
  const issues = [];
  let examples = 0;
  for (const summary of models) {
    const model = await loadModelDetail(summary.slug);
    for (const group of modelExampleGroups(model)) {
      examples += group.examples.length;
      for (const issue of group.issues || [])
        issues.push({
          model: model.name,
          slug: model.slug,
          sourceUrl: model.sourceUrl,
          ...issue,
        });
    }
  }
  await fs.writeFile(
    "docs/source-audit/unavailable-examples.json",
    JSON.stringify(issues, null, 2) + "\n",
  );
  const result = {
    models: models.length,
    verifiedDetails: models.length,
    docs: docs.length,
    sections: docs.reduce((n, a) => n + a.sections.length, 0),
    tables: docs.reduce(
      (n, a) => n + a.sections.reduce((s, c) => s + (c.tables || []).length, 0),
      0,
    ),
    documentCodeExamples: docs.reduce(
      (n, a) =>
        n + a.sections.reduce((s, c) => s + (c.codeExamples || []).length, 0),
      0,
    ),
    documentLinks: docs.reduce((n, a) => n + (a.links || []).length, 0),
    illustrations: docs.reduce((n, a) => n + (a.illustrations || []).length, 0),
    displayedModelExamples: examples,
    unavailableModelExamples: issues.length,
    monthlyPlans: 4,
    faqItems: 6,
  };
  await fs.writeFile(
    "docs/source-audit/coverage.json",
    JSON.stringify(result, null, 2) + "\n",
  );
  console.log(JSON.stringify(result));
} finally {
  await server.close();
}
