import { ConfigurationSchema } from "../types/ConfigurationSchema";
import { dirname } from "path";
import { FileCallbackArguments } from "../types/FileCallbackArguments";
import {
  addToDiscoveredPackageRoots,
  isPackageRootIndex,
} from "../functions/isPackageRootIndex";
import { ExposeCallbackArguments } from "../types/ExposeCallbackArguments";
import { buildExternalName } from "../functions";

/**
 * Creates a TECPackage schema with a custom namespace.
 *
 * @param {string|string[]} [namespace="tec"] - The namespace to use for the schema.
 * @returns {ConfigurationSchema} The configured schema.
 */
export function createTECPackage(
  namespace: string | string[] = "tec",
): ConfigurationSchema {
  /**
   * Determines if a file should be matched based on specific criteria.
   *
   * @param {FileCallbackArguments} args - The arguments containing file information.
   * @returns {boolean} - True if the file matches the criteria, false otherwise.
   */
  function fileMatcher({
    fileAbsolutePath,
    fileName,
    fileRelativePath,
  }: FileCallbackArguments): boolean {
    if (fileAbsolutePath.includes("__tests__")) {
      return false;
    }

    return (
      fileName.match(/index\.(js|jsx|ts|tsx)$/) !== null &&
      isPackageRootIndex(fileRelativePath)
    );
  }

  /**
   * Generates the entry point name for a given file.
   *
   * @param {FileCallbackArguments} args - The arguments containing file information.
   * @returns {string} - The directory name of the file's relative path.
   */
  function entryPointName({ fileRelativePath }: FileCallbackArguments): string {
    addToDiscoveredPackageRoots(dirname(fileRelativePath));
    return dirname(fileRelativePath);
  }

  /**
   * Determines if a file should be exposed and generates an external name for it.
   *
   * @param {ExposeCallbackArguments} args - The arguments containing the entry point name and absolute file path.
   * @returns {string | false} - Returns the external name if the file should be exposed, false otherwise.
   */
  function expose({ entryPointName }: ExposeCallbackArguments): string | false {
    // From 'resources/packages/customizer-views-v2-live-preview' to  'tec.customizerViewsV2LivePreview'.
    // From 'resources/packages/tec-update-6.0.0-notice' to 'tec.tecUpdate600Notice'.
    return buildExternalName(namespace, entryPointName, ["js"]);
  }

  return {
    fileExtensions: [".js", ".jsx", ".ts", ".tsx"],
    namespace,
    fileMatcher,
    entryPointName,
    expose,
  };
}

/**
 * Default TECPackage schema with "tec" namespace.
 */
export const TECPackage = createTECPackage();
