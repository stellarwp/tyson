import { WebPackConfiguration } from "../../src/types/WebPackConfiguration";
import { preprocessPostcssWithPlugins } from "../../src/functions/preprocessPostcssWithPlugins";
import { modifyRulesInConfig } from "../../src/functions";

describe("preprocessPostcssWithPlugins", () => {
  it("should throw an error if the plugins parameter is not an array of strings", () => {
    expect(() =>
      preprocessPostcssWithPlugins({} as WebPackConfiguration, null as any),
    ).toThrow(
      "Invalid plugin set provided. Plugin set must be an array of strings.",
    );
  });

  it("should correctly modify the configuration and set the given plugins in PostCSS loader rule", () => {
    const config: WebPackConfiguration = {
      module: {
        rules: [
          { test: /\.pcss$/, use: ["postcss-loader"], type: "javascript/auto" },
          {
            test: /\.css$/,
            use: [{ loader: "style-loader" }],
            type: "javascript/auto",
          },
        ],
      },
    };

    preprocessPostcssWithPlugins(config, ["plugin1", "plugin2"]);

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
                    plugins: ["plugin1", "plugin2"],
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

  it("should correctly modify the configuration and prepend the given plugins to all PostCSS loader rules", () => {
    const config: WebPackConfiguration = {
      module: {
        rules: [
          {
            test: /\.css$/,
            use: [{ loader: "style-loader" }],
            type: "javascript/auto",
          },
          {
            test: /\.pcss$/,
            use: [
              {
                loader: "/node_modules/mini-css-extract-plugin/dist/loader.js",
              },
              {
                loader: "/node_modules/css-loader/dist/cjs.js",
                options: {
                  importLoaders: 1,
                  sourceMap: false,
                  modules: {
                    auto: true,
                  },
                },
              },
              "postcss-loader",
            ],
            type: "javascript/auto",
          },
          {
            test: /\.css$/,
            use: [{ loader: "style-loader" }],
            type: "javascript/auto",
          },
          {
            test: /\.pcss$/,
            use: [
              {
                loader: "postcss-loader",
                options: {
                  postcssOptions: {
                    plugins: ["plugin3", "plugin4"],
                  },
                },
              },
              {
                loader: "/node_modules/css-loader/dist/cjs.js",
                options: {
                  importLoaders: 1,
                  sourceMap: false,
                  modules: {
                    auto: true,
                  },
                },
              },
            ],
            type: "javascript/auto",
          },
        ],
      },
    };

    preprocessPostcssWithPlugins(config, ["plugin1", "plugin2"]);

    expect(config).toEqual({
      module: {
        rules: [
          {
            test: /\.css$/,
            use: [{ loader: "style-loader" }],
            type: "javascript/auto",
          },
          {
            test: /\.pcss$/,
            use: [
              {
                loader: "/node_modules/mini-css-extract-plugin/dist/loader.js",
              },
              {
                loader: "/node_modules/css-loader/dist/cjs.js",
                options: {
                  importLoaders: 1,
                  sourceMap: false,
                  modules: {
                    auto: true,
                  },
                },
              },
              {
                loader: "postcss-loader",
                options: {
                  postcssOptions: {
                    plugins: ["plugin1", "plugin2"],
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
          {
            test: /\.pcss$/,
            use: [
              {
                loader: "postcss-loader",
                options: {
                  postcssOptions: {
                    plugins: ["plugin1", "plugin2", "plugin3", "plugin4"],
                  },
                },
              },
              {
                loader: "/node_modules/css-loader/dist/cjs.js",
                options: {
                  importLoaders: 1,
                  sourceMap: false,
                  modules: {
                    auto: true,
                  },
                },
              },
            ],
            type: "javascript/auto",
          },
        ],
      },
    });
  });
});
