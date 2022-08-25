const config = {
  type: "app",
  name: "Duplicate Beneficiaries Evaluator",
  entryPoints: {
    app: "./src/App.tsx",
  },
  pwa: {
    enabled: true,
    caching: {
      patternsToOmit: ["trackedEntityInstances", "events"],
    },
  },
};

module.exports = config;
