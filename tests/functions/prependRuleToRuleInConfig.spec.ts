import { WebPackConfiguration } from "../../src/types/WebPackConfiguration";
import { WebPackRule } from "../../src/types/WebPackRule";
import { prependRuleToRuleInConfig } from "../../src";

describe("prependRuleToRuleInConfig", () => {
  it("should prepend a rule to an existing rule in the configuration", () => {
    const config: WebPackConfiguration = {
      module: {
        rules: [
          { test: /\.js$/, type: "javascript/auto" },
          { test: /\.css$/, type: "css/auto" },
        ],
      },
    };
    const newRule: WebPackRule = { test: /\.ts$/, type: "javascript/dynamic" };

    prependRuleToRuleInConfig(
      config,
      newRule,
      (r) => r.test?.toString() === "/\\.css$/",
    );

    expect(config.module.rules).toEqual([
      { test: /\.js$/, type: "javascript/auto" },
      { test: /\.ts$/, type: "javascript/dynamic" },
      { test: /\.css$/, type: "css/auto" },
    ]);
  });

  it("should throw an error if no matching rule is found", () => {
    const config: WebPackConfiguration = {
      module: {
        rules: [
          { test: /\.js$/, type: "javascript/auto" },
          { test: /\.css$/, type: "css/auto" },
        ],
      },
    };
    const newRule: WebPackRule = { test: /\.ts$/, type: "javascript/dynamic" };

    expect(() =>
      prependRuleToRuleInConfig(
        config,
        newRule,
        (r) => r.test?.toString() === "/\\.html$/",
      ),
    ).toThrow("No matching rule found");
  });

  it("should handle empty rules array", () => {
    const config: WebPackConfiguration = {
      module: {
        rules: [],
      },
    };
    const newRule: WebPackRule = { test: /\.ts$/, type: "javascript/dynamic" };

    expect(() =>
      prependRuleToRuleInConfig(
        config,
        newRule,
        (r) => r.test?.toString() === "/\\.html$/",
      ),
    ).toThrow("No matching rule found");
  });

  it("should handle undefined rules", () => {
    const config: WebPackConfiguration = {
      module: {
        rules: undefined as any,
      },
    };
    const newRule: WebPackRule = { test: /\.ts$/, type: "javascript/dynamic" };

    expect(() =>
      prependRuleToRuleInConfig(
        config,
        newRule,
        (r) => r.test?.toString() === "/\\.html$/",
      ),
    ).toThrow("No matching rule found");
  });

  it("should handle null rules", () => {
    const config: WebPackConfiguration = {
      module: {
        rules: null as any,
      },
    };
    const newRule: WebPackRule = { test: /\.ts$/, type: "javascript/dynamic" };

    expect(() =>
      prependRuleToRuleInConfig(
        config,
        newRule,
        (r) => r.test?.toString() === "/\\.html$/",
      ),
    ).toThrow("No matching rule found");
  });
});
