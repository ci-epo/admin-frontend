import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  // Les specs Playwright (__tests__/e2e) ne doivent pas être exécutées par Jest.
  testPathIgnorePatterns: ["/node_modules/", "/.next/", "<rootDir>/__tests__/e2e/"],
};

export default createJestConfig(config);
