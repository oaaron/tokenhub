const files = import.meta.glob("./model-details/*.json", { import: "default" });
export function loadModelDetail(slug) {
  const loader = files[`./model-details/${slug}.json`];
  return loader
    ? loader().then((model) => ({
        ...model,
        sourceRegion: model.sourceRegion || "cn",
        sourceCatalog: model.sourceCatalog || "AntDigital",
      }))
    : Promise.reject(new Error("Unknown model"));
}
