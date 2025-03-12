import { ConfigurationSchema } from "../types/ConfigurationSchema";
import { FileCallbackArguments } from "../types/FileCallbackArguments";
import { ExposeCallbackArguments } from "../types/ExposeCallbackArguments";
import { buildExternalName } from "../functions/buildExternalName";

/**
 * Creates a TECLegacyJs schema with a custom namespace.
 *
 * @param {string|string[]} [namespace="tec"] - The namespace to use for the schema.
 * @returns {ConfigurationSchema} The configured schema.
 */
export function createTECLegacyJs(
  namespace: string | string[] = "tec",
): ConfigurationSchema {
  /**
   * Determines if a file should be included based on its name and path.
   *
   * @param {FileCallbackArguments} args - The arguments containing the file name and relative path.
   * @returns {boolean} - Returns true if the file should be included, false otherwise.
   */
  function fileMatcher({
    fileName,
    fileRelativePath,
  }: FileCallbackArguments): boolean {
    return !(
      fileName.endsWith(".min.js") || fileRelativePath.includes("__tests__")
    );
  }

  /**
   * Generates an entry point name for a given file path.
   *
   * @param {FileCallbackArguments} args - The arguments containing the relative file path.
   * @returns {string} - The generated entry point name.
   */
  function entryPointName({ fileRelativePath }: FileCallbackArguments): string {
    return "js" + fileRelativePath.replace(/\.js$/, "");
  }

  /**
   * Determines if a file should be exposed and generates an external name for it.
   *
   * @param {ExposeCallbackArguments} args - The arguments containing the entry point name and absolute file path.
   * @returns {string | false} - Returns the external name if the file should be exposed, false otherwise.
   */
  function expose({
    entryPointName,
    fileAbsolutePath,
  }: ExposeCallbackArguments): string | false {
    // From 'js/customizer-views-v2-live-preview' to  'tec.customizerViewsV2LivePreview'.
    // From 'js/tec-update-6.0.0-notice' to 'tec.tecUpdate600Notice'.
    return fileAbsolutePath.match(/frontend\.js$/)
      ? false
      : buildExternalName(namespace, entryPointName, ["js"]);
  }

  return {
    fileExtensions: [".js"],
    namespace,
    fileMatcher,
    entryPointName,
    expose,
  };
}

/**
 * Default TECLegacyJs schema with "tec" namespace.
 */
export const TECLegacyJs = createTECLegacyJs();
