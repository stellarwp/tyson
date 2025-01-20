import { ConfigurationSchema } from "../types/ConfigurationSchema";
import { basename, dirname } from "path";
import { FileCallbackArguments } from "../types/FileCallbackArguments";

/**
 * Matches files only if they are called `frontend.pcss`.
 *
 * @param {FileCallbackArguments} args - The arguments containing the file name to match.
 * @returns {boolean} - True if the file name is `frontend.pcss`, otherwise false.
 */
function fileMatcher({ fileName }: FileCallbackArguments): boolean {
  return fileName === "frontend.pcss";
}

/**
 * Builds and returns the compilation entry point name.
 * E.g. `app/classic-event-details/frontend.css`
 *
 * @param {FileCallbackArguments} args - The arguments containing the relative path of the file.
 * @returns {string} - The constructed entry point name.
 */
function entryPointName({ fileRelativePath }: FileCallbackArguments): string {
  return "app/" + basename(dirname(fileRelativePath)) + "/frontend";
}

/**
 * Configuration schema for TECLegacyBlocksFrontendPostCss.
 *
 * @type {ConfigurationSchema}
 * @property {string[]} fileExtensions - The file extensions to match, in this case only `.pcss`.
 * @property {function} fileMatcher - Function to match specific files.
 * @property {function} entryPointName - Function to generate the entry point name based on file path.
 */
export const TECLegacyBlocksFrontendPostCss: ConfigurationSchema = {
  fileExtensions: [".pcss"], // Only match `.pcss` files.
  fileMatcher,
  entryPointName,
};
