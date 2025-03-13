import { ConfigurationSchema } from "../types/ConfigurationSchema";
import { WebPackConfiguration } from "../types/WebPackConfiguration";
import { FileCallbackArguments } from "../types/FileCallbackArguments";
import { preprocessPostcssWithPlugins } from "../functions";

/**
 * Creates a TECPostCss schema with a custom namespace.
 *
 * @param {string|string[]} [namespace="tec"] - The namespace to use for the schema.
 * @returns {ConfigurationSchema} The configured schema.
 */
export function createTECPostCss(
  namespace: string | string[] = "tec",
): ConfigurationSchema {
  /**
   * Determines if a file should be included based on its name.
   * @param {FileCallbackArguments} args - The arguments containing the file name.
   * @returns {boolean} - True if the file name does not start with "_", otherwise false.
   */
  function fileMatcher({ fileName }: FileCallbackArguments): boolean {
    return !fileName.startsWith("_");
  }

  /**
   * Generates an entry point name for a given file path.
   * @param {FileCallbackArguments} args - The arguments containing the relative file path.
   * @returns {string} - The generated entry point name with ".pcss" replaced by an empty string and prefixed with "css/".
   */
  function entryPointName({ fileRelativePath }: FileCallbackArguments): string {
    return "css/" + fileRelativePath.replace(".pcss", "");
  }

  /**
   * Modifies the WebPack configuration to include a rule for processing PostCSS files in the `src/modules` directory.
   * The rule uses the `postcss-loader` with the `postcss-nested` plugin to handle nesting syntax.
   * PostCSS files in the `src/modules` directory use PostCSS nesting, where `&` indicates "this".
   * By default WordPress scripts would use new CSS nesting syntax where `&` indicates the parent.
   * We add here the `postcss-nested` plugin to allow the use of `&` to mean "this".
   * In webpack loaders are applied in LIFO order: this will prepare the PostCSS for the default `postcss-loader`.
   *
   * @param {WebPackConfiguration} config - The WebPack configuration object to be modified.
   */
  function modifyConfig(config: WebPackConfiguration): void {
    config.module.rules.push({
      test: /\.pcss$/,
      use: [
        {
          loader: "postcss-loader",
          options: {
            postcssOptions: {
              plugins: ["postcss-nested", "postcss-preset-env", "postcss-mixins", "postcss-import", "postcss-custom-media"],
            },
          },
        },
      ],
      type: "javascript/auto",
    });
  }

  return {
    fileExtensions: [".pcss"],
    namespace,
    fileMatcher,
    entryPointName,
    modifyConfig,
  };
}

/**
 * Default TECPostCss schema with "tec" namespace.
 */
export const TECPostCss = createTECPostCss();
