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
 * Determines if a file should be matched based on specific criteria.
 *
 * @param {FileCallbackArguments} args - The arguments containing file information.
 * @returns {boolean} - True if the file matches the criteria, false otherwise.
 */
export function fileMatcher({
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
export function entryPointName({
  fileRelativePath,
}: FileCallbackArguments): string {
  addToDiscoveredPackageRoots(dirname(fileRelativePath));
  return dirname(fileRelativePath);
}

/**
 * Determines if a file should be exposed and generates an external name for it.
 *
 * @param {ExposeCallbackArguments} args - The arguments containing the entry point name and absolute file path.
 * @returns {string | false} - Returns the external name if the file should be exposed, false otherwise.
 */
export function expose({
  entryPointName,
  fileAbsolutePath,
}: ExposeCallbackArguments): string | false {
  // From 'resources/packages/customizer-views-v2-live-preview' to  'tec.customizerViewsV2LivePreview'.
  // From 'resources/packages/tec-update-6.0.0-notice' to 'tec.tecUpdate600Notice'.
  return buildExternalName("tec", entryPointName, ["js"]);
}

/**
 * Configuration schema for the TEC package.
 *
 * @type {ConfigurationSchema}
 * @property {string[]} fileExtensions - The file extensions to be considered.
 * @property {function} fileMatcher - Function to match files based on specific criteria.
 * @property {function} entryPointName - Function to generate the entry point name for a given file.
 */
export const TECPackage: ConfigurationSchema = {
  fileExtensions: [".js", ".jsx", ".ts", ".tsx"],
  fileMatcher,
  entryPointName,
  expose,
};
