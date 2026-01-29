export default {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["./src"],
  setupFiles: ["<rootDir>/jest.setup.ts"],
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.ts?$",
  moduleFileExtensions: ["ts", "js", "json", "node"],
  collectCoverageFrom: [
    "src/util/**/*.ts",
    "!src/util/**/*.test.ts",
    "!src/util/**/__tests__/**",
  ],
  testPathIgnorePatterns: ["__tests__/helpers/"],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 100,
      lines: 95,
      statements: 95,
    },
  },
};
