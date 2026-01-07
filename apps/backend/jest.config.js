// Jest Configuration
module.exports = {
  testEnvironment: "node",
  collectCoverageFrom: [
    "routes/**/*.js",
    "models/**/*.js",
    "middleware/**/*.js",
    "utils/**/*.js",
  ],
  coveragePathIgnorePatterns: ["/node_modules/", "/__tests__/"],
  testMatch: ["**/__tests__/**/*.test.js"],
  verbose: true,
};
