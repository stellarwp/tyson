import { ConfigurationSchema } from "../types/ConfigurationSchema";
import { FileCallbackArguments } from "../types/FileCallbackArguments";
import { ExposeCallbackArguments } from "../types/ExposeCallbackArguments";
import { buildExternalName } from "../functions/buildExternalName";

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
    : buildExternalName("tec", entryPointName, ["js"]);
}

/**
 * Configuration schema for TECLegacyBlocksFrontendPostCss.
 *
 * @type {ConfigurationSchema}
 * @property {string[]} fileExtensions - The file extensions to match, in this case only `.pcss`.
 * @property {function} fileMatcher - Function to match specific files.
 * @property {function} entryPointName - Function to generate the entry point name based on file path.
 * @property {function} expose  - Function to dynamically build the window expose path.
 */
export const TECLegacyJs: ConfigurationSchema = {
  fileExtensions: [".js"],
  fileMatcher,
  entryPointName,
  expose,
};
