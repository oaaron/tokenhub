import { describe, expect, it } from "vitest";
import { spawnSync } from "node:child_process";
import { modelExampleGroups } from "./modelExamples";
import { loadModelDetail } from "./modelDetails";
import { models } from "./models";
import archivedModels from "./models.json";

describe("source model examples", () => {
  it("keeps every displayed Python and shell sample syntactically valid", async () => {
    const failures = [];
    for (const summary of [...models, ...archivedModels]) {
      const model = await loadModelDetail(summary.slug);
      for (const group of modelExampleGroups(model)) {
        for (const example of group.examples) {
          const python = /^python/i.test(example.language);
          const shell = /^(curl|bash|shell)/i.test(example.language);
          if (!python && !shell) continue;
          const result = spawnSync(
            python ? "python3" : "bash",
            python
              ? ["-c", "import ast,sys; ast.parse(sys.stdin.read())"]
              : ["-n"],
            { input: example.code, encoding: "utf8" },
          );
          if (result.status !== 0)
            failures.push(
              `${model.name}: ${example.language}: ${result.stderr || result.error}`,
            );
        }
      }
    }
    expect(failures).toEqual([]);
  }, 30000);

  it("does not invent endpoint examples for the active catalog", async () => {
    for (const model of models) {
      const detail = await loadModelDetail(model.slug);
      expect(detail.exampleCodes).toEqual([]);
      expect(
        modelExampleGroups(detail).flatMap((group) => group.examples),
      ).toEqual([]);
    }
  });

  it("records uncertain source samples without inventing operation paths", async () => {
    const model = await loadModelDetail(
      archivedModels.find((model) => model.name === "qwen-plus").slug,
    );
    const groups = modelExampleGroups(model);
    expect(
      groups
        .flatMap((group) => group.issues || [])
        .some((issue) => issue.reason.includes("操作路径")),
    ).toBe(true);
    expect(
      groups
        .flatMap((group) => group.examples)
        .every(
          (example) => !example.code.includes("https://maas.antdigital.com/v1"),
        ),
    ).toBe(true);
  });

  it("corrects swapped language labels and credential placeholders", async () => {
    const groups = modelExampleGroups(
      await loadModelDetail(
        archivedModels.find((model) => model.name === "lingsante-3.1-flash")
          .slug,
      ),
    );
    const examples = groups.flatMap((group) => group.examples);
    expect(
      examples.some(
        (example) =>
          /^python/.test(example.language) &&
          example.code.includes('os.environ["VELINK_API_KEY"]'),
      ),
    ).toBe(true);
    expect(
      examples.some(
        (example) =>
          /^curl/.test(example.language) &&
          example.code.includes("$VELINK_API_KEY"),
      ),
    ).toBe(true);
  });
});
