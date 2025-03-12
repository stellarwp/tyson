import { ConfigurationSchema } from "../types/ConfigurationSchema";
import { FileCallbackArguments } from "../types/FileCallbackArguments";

/**
 * Creates a TECLegacyBlocksFrontendPostCss schema with a custom namespace.
 *
 * @param {string|string[]} [namespace="tec"] - The namespace to use for the schema.
 * @returns {ConfigurationSchema} The configured schema.
 */
export function createTECLegacyBlocksFrontendPostCss(
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
   * @returns {string} - The generated entry point name with ".pcss" replaced by an empty string.
   */
  function entryPointName({ fileRelativePath }: FileCallbackArguments): string {
    return fileRelativePath.replace(".pcss", "");
  }

  return {
    fileExtensions: [".pcss"],
    namespace,
    fileMatcher,
    entryPointName,
  };
}

/**
 * Default TECLegacyBlocksFrontendPostCss schema with "tec" namespace.
 */
export const TECLegacyBlocksFrontendPostCss =
  createTECLegacyBlocksFrontendPostCss();
