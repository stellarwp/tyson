module.exports = {
  roots: ["<rootDir>/tests"],
  testMatch: ["**/*.spec.ts"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
};
