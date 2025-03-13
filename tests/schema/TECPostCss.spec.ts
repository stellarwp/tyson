import { TECPostCss, createTECPostCss } from "../../src/schema/TECPostCss";
import { WebPackConfiguration } from "../../src/types/WebPackConfiguration";
import { FileCallbackArguments } from "../../src/types/FileCallbackArguments";
import { WebPackRule } from "../../src/types/WebPackRule";

type TestWebPackConfig = Required<WebPackConfiguration> & {
  module: {
    rules: WebPackRule[];
  };
};

describe("TECPostCss", () => {
  describe("default instance", () => {
    it("should have the correct file extensions", () => {
      expect(TECPostCss.fileExtensions).toEqual([".pcss"]);
    });

    it("should have the default namespace", () => {
      expect(TECPostCss.namespace).toBe("tec");
    });
  });

  describe("createTECPostCss", () => {
    it("should create a schema with custom string namespace", () => {
      const schema = createTECPostCss("custom");
      expect(schema.namespace).toBe("custom");
    });

    it("should create a schema with custom array namespace", () => {
      const schema = createTECPostCss(["custom", "namespace"]);
      expect(schema.namespace).toEqual(["custom", "namespace"]);
    });

    it("should use default namespace when none provided", () => {
      const schema = createTECPostCss();
      expect(schema.namespace).toBe("tec");
    });
  });

  describe("fileMatcher", () => {
    it("should exclude files starting with underscore", () => {
      const args: FileCallbackArguments = {
        fileName: "_partial.pcss",
        fileRelativePath: "styles/_partial.pcss",
        fileAbsolutePath: "/abs/path/styles/_partial.pcss",
      };
      expect(TECPostCss.fileMatcher(args)).toBe(false);
    });

    it("should include regular pcss files", () => {
      const args: FileCallbackArguments = {
        fileName: "styles.pcss",
        fileRelativePath: "styles/styles.pcss",
        fileAbsolutePath: "/abs/path/styles/styles.pcss",
      };
      expect(TECPostCss.fileMatcher(args)).toBe(true);
    });
  });

  describe("entryPointName", () => {
    it("should generate correct entry point name", () => {
      const args: FileCallbackArguments = {
        fileName: "styles.pcss",
        fileRelativePath: "feature/styles.pcss",
        fileAbsolutePath: "/abs/path/feature/styles.pcss",
      };
      expect(TECPostCss.entryPointName(args)).toBe("css/feature/styles");
    });
  });

  describe("modifyConfig", () => {
    it("should add postcss-loader with nested plugin when no previous postcss plugins are set", () => {
      const config: TestWebPackConfig = {
        module: {
          rules: [
            {
              test: /\.pcss$/,
              use: ["postcss-loader"],
              type: "javascript/auto",
            },
            {
              test: /\.css$/,
              use: [{ loader: "style-loader" }],
              type: "javascript/auto",
            },
          ],
        },
      };

      expect(TECPostCss.modifyConfig).toBeDefined();
      TECPostCss.modifyConfig!(config);

      const rules = config.module.rules;
      expect(rules).toHaveLength(2);
      expect(config).toEqual({
        module: {
          rules: [
            {
              test: /\.pcss$/,
              use: [
                {
                  loader: "postcss-loader",
                  options: {
                    postcssOptions: {
                      plugins: [
                        "postcss-nested",
                        "postcss-preset-env",
                        "postcss-mixins",
                        "postcss-import",
                        "postcss-custom-media",
                      ],
                    },
                  },
                },
              ],
              type: "javascript/auto",
            },
            {
              test: /\.css$/,
              use: [{ loader: "style-loader" }],
              type: "javascript/auto",
            },
          ],
        },
      });
    });

    it("should add postcss-loader with nested plugin when previous postcss plugins are set", () => {
      const config: TestWebPackConfig = {
        module: {
          rules: [
            {
              test: /\.pcss$/,
              use: [
                {
                  loader: "postcss-loader",
                  options: {
                    postcssOptions: {
                      plugins: ["postcss-plugin-1", "postcss-plugin-2"],
                    },
                  },
                },
              ],
              type: "javascript/auto",
            },
            {
              test: /\.css$/,
              use: [{ loader: "style-loader" }],
              type: "javascript/auto",
            },
          ],
        },
      };

      expect(TECPostCss.modifyConfig).toBeDefined();
      TECPostCss.modifyConfig!(config);

      const rules = config.module.rules;
      expect(rules).toHaveLength(2);
      expect(config).toEqual({
        module: {
          rules: [
            {
              test: /\.pcss$/,
              use: [
                {
                  loader: "postcss-loader",
                  options: {
                    postcssOptions: {
                      plugins: [
                        "postcss-nested",
                        "postcss-preset-env",
                        "postcss-mixins",
                        "postcss-import",
                        "postcss-custom-media",
                        "postcss-plugin-1",
                        "postcss-plugin-2",
                      ],
                    },
                  },
                },
              ],
              type: "javascript/auto",
            },
            {
              test: /\.css$/,
              use: [{ loader: "style-loader" }],
              type: "javascript/auto",
            },
          ],
        },
      });
    });

    it("does not override existing rules", () => {
      const config: TestWebPackConfig = {
        module: {
          rules: [
            {
              test: /\.js$/,
              use: "babel-loader",
              type: "javascript/auto",
            } as WebPackRule,
          ],
        },
      };

      expect(TECPostCss.modifyConfig).toBeDefined();
      TECPostCss.modifyConfig!(config);

      const rules = config.module.rules;
      expect(rules).toHaveLength(1);
      expect(rules[0]).toEqual({
        test: /\.js$/,
        use: "babel-loader",
        type: "javascript/auto",
      });
    });
  });
});
