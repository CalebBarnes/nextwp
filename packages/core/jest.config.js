module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", { tsconfig: "tsconfig.jest.json" }],
  },
  moduleDirectories: ["node_modules", "src"],
  setupFilesAfterEnv: ["./jest.setup.ts"],
  testMatch: [
    "<rootDir>/tests/**/*.test.ts", // For TypeScript tests
    "<rootDir>/tests/**/*.test.tsx", // For TypeScript React tests
    "<rootDir>/tests/**/*.test.js", // For JavaScript tests
    "<rootDir>/tests/**/*.test.jsx", // For JavaScript React tests
  ],
};
