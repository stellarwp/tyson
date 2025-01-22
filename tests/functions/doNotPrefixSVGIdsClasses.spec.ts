import { WebPackConfiguration } from "../../src/types/WebPackConfiguration";
import { doNotPrefixSVGIdsClasses } from "../../src";

describe("doNotPrefixSVGIdsClasses", () => {
  it("should prepend a rule for SVG files in src/modules directory", () => {
    const config: WebPackConfiguration = {
      module: {
        rules: [
          {
            test: /\.svg$/,
            use: "@svgr/webpack",
            type: "javascript/auto",
          },
        ],
      },
    };

    doNotPrefixSVGIdsClasses(config);

    expect(config.module.rules).toHaveLength(2);
    expect(config.module.rules[0]).toEqual({
      test: /\/src\/modules\/.*?\.svg$/,
      issuer: /\.(j|t)sx?$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            svgoConfig: {
              plugins: [
                {
                  name: "prefixIds",
                  params: {
                    prefixIds: false,
                    prefixClassNames: false,
                  },
                },
              ],
            },
          },
        },
        {
          loader: "url-loader",
        },
      ],
      type: "javascript/auto",
    });
  });

  it("should throw an error if no matching rule is found", () => {
    const config: WebPackConfiguration = {
      module: {
        rules: [
          {
            test: /\.png$/,
            use: "file-loader",
            type: "javascript/auto",
          },
        ],
      },
    };

    expect(() => doNotPrefixSVGIdsClasses(config)).toThrow(
      "No matching rule found",
    );
  });

  it("should handle an empty configuration", () => {
    const config: WebPackConfiguration = {
      module: {},
    };

    expect(() => doNotPrefixSVGIdsClasses(config)).toThrow(
      "No matching rule found",
    );
  });
});
