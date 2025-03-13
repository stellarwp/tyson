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
   * By default, the first PostCSS processor the `@wordpress/scripts` library would apply is the `autoprefixer` one.
   * This plugin expects a correct hierarchical PostCSS structure following the CSS nesting convention (where `&` means
   * `parent`). TEC code follows the PostCSS nesting convention (where `&` means `this`). Furthermore, TEC relies on other
   * PostCSS plugins to unroll the code. These plugins, applied before the `autoprefixer` one, will make the PostCSS code
   * digestable for the `autoprefixer` plugin and the following ones.
   *
   * @param {WebPackConfiguration} config - The WebPack configuration object to be modified.
   */
  function modifyConfig(config: WebPackConfiguration): void {
    preprocessPostcssWithPlugins(config, [
      "postcss-nested",
      "postcss-preset-env",
      "postcss-mixins",
      "postcss-import",
      "postcss-custom-media",
    ]);
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
