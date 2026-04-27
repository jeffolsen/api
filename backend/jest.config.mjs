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
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@services/(.*)$": "<rootDir>/src/services/$1",
    "^@controllers/(.*)$": "<rootDir>/src/controllers/$1",
    "^@middleware/(.*)$": "<rootDir>/src/middleware/$1",
    "^@config/(.*)$": "<rootDir>/src/config/$1",
    "^@util/(.*)$": "<rootDir>/src/util/$1",
    "^@schemas/(.*)$": "<rootDir>/src/schemas/$1",
    "^@db/(.*)$": "<rootDir>/src/db/$1",
  },
};
