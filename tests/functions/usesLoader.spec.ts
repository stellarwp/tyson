import { usesLoader } from "../../src/functions/usesLoader";

describe("usesLoader", () => {
  it("should return true if the loader is found in the rule use property", () => {
    const ruleUse = [{ loader: "babel-loader" }, "some-other-loader"];
    expect(usesLoader(ruleUse, "babel-loader")).toBe(true);
  });

  it("should return false if the loader is not found in the rule use property", () => {
    const ruleUse = [{ loader: "babel-loader" }, "some-other-loader"];
    expect(usesLoader(ruleUse, "webpack-loader")).toBe(false);
  });

  it("should return true if the loader is found in the rule use property as a string", () => {
    const ruleUse = ["babel-loader", "some-other-loader"];
    expect(usesLoader(ruleUse, "babel-loader")).toBe(true);
  });

  it("should return false if the loader is not found in the rule use property as a string", () => {
    const ruleUse = ["babel-loader", "some-other-loader"];
    expect(usesLoader(ruleUse, "webpack-loader")).toBe(false);
  });

  it("should return true if the loader is found in the rule use property as a UseEntryObject", () => {
    const ruleUse = [
      { loader: "babel-loader" },
      { loader: "some-other-loader" },
    ];
    expect(usesLoader(ruleUse, "babel-loader")).toBe(true);
  });

  it("should return false if the loader is not found in the rule use property as a UseEntryObject", () => {
    const ruleUse = [
      { loader: "babel-loader" },
      { loader: "some-other-loader" },
    ];
    expect(usesLoader(ruleUse, "webpack-loader")).toBe(false);
  });
});
