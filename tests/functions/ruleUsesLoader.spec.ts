import { ruleUsesLoader } from "../../src";

describe("ruleUsesLoader", () => {
  it("returns false when rule.use is undefined", () => {
    expect(ruleUsesLoader({ type: "javascript/auto" }, "some-loader")).toBe(
      false,
    );
  });

  it("returns true when rule.use is a string and includes the loader", () => {
    expect(
      ruleUsesLoader(
        { use: "some-loader", type: "javascript/auto" },
        "some-loader",
      ),
    ).toBe(true);
  });

  it("returns false when rule.use is a string and does not include the loader", () => {
    expect(
      ruleUsesLoader(
        { use: "other-loader", type: "javascript/auto" },
        "some-loader",
      ),
    ).toBe(false);
  });

  it("returns true when rule.use is an array of strings and includes the loader", () => {
    expect(
      ruleUsesLoader(
        { use: ["loader1", "some-loader"], type: "javascript/auto" },
        "some-loader",
      ),
    ).toBe(true);
  });

  it("returns false when rule.use is an array of strings and does not include the loader", () => {
    expect(
      ruleUsesLoader(
        { use: ["loader1", "loader2"], type: "javascript/auto" },
        "some-loader",
      ),
    ).toBe(false);
  });

  it("returns true when rule.use is an array of objects with a matching loader", () => {
    expect(
      ruleUsesLoader(
        { use: [{ loader: "some-loader" }], type: "javascript/auto" },
        "some-loader",
      ),
    ).toBe(true);
  });

  it("returns false when rule.use is an array of objects without a matching loader", () => {
    expect(
      ruleUsesLoader(
        { use: [{ loader: "other-loader" }], type: "javascript/auto" },
        "some-loader",
      ),
    ).toBe(false);
  });

  it("returns true when rule.use is an array with mixed strings and objects, including the loader", () => {
    expect(
      ruleUsesLoader(
        {
          use: ["loader1", { loader: "some-loader" }],
          type: "javascript/auto",
        },
        "some-loader",
      ),
    ).toBe(true);
  });

  it("returns false when rule.use is an array with mixed strings and objects, excluding the loader", () => {
    expect(
      ruleUsesLoader(
        {
          use: ["loader1", { loader: "other-loader" }],
          type: "javascript/auto",
        },
        "some-loader",
      ),
    ).toBe(false);
  });

  it("returns true when loader is a substring of the actual loader name", () => {
    expect(
      ruleUsesLoader({ use: "babel-loader", type: "javascript/auto" }, "babel"),
    ).toBe(true);
  });

  it("handles empty strings correctly", () => {
    expect(ruleUsesLoader({ use: "", type: "javascript/auto" }, "")).toBe(
      false,
    );
  });
});
