export default {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
  },
  // Ignore configuration files that don't need tests
  testPathIgnorePatterns: [
    "/node_modules/",
    "/dist/",
    "database.test.ts",
    "test.config.ts",
  ],
};
