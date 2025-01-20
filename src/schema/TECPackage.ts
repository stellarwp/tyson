import { ConfigurationSchema } from "../types/ConfigurationSchema";
import { dirname } from "path";
import { FileCallbackArguments } from "../types/FileCallbackArguments";
import {
  addToDiscoveredPackageRoots,
  isPackageRootIndex,
} from "../functions/isPackageRootIndex";

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
  return (
    !fileAbsolutePath.includes("__tests__") &&
    fileName.match(/index\.(js|jsx|ts|tsx)$/) &&
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
};
