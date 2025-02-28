"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TECLegacyBlocksFrontendPostCss = void 0;
exports.fileMatcher = fileMatcher;
exports.entryPointName = entryPointName;
const path_1 = require("path");
/**
 * Matches files only if they are called `frontend.pcss`.
 *
 * @param {FileCallbackArguments} args - The arguments containing the file name to match.
 * @returns {boolean} - True if the file name is `frontend.pcss`, otherwise false.
 */
function fileMatcher({ fileName }) {
    return fileName === "frontend.pcss";
}
/**
 * Builds and returns the compilation entry point name.
 * E.g. `app/classic-event-details/frontend.css`
 *
 * @param {FileCallbackArguments} args - The arguments containing the relative path of the file.
 * @returns {string} - The constructed entry point name.
 */
function entryPointName({ fileRelativePath, }) {
    return "app/" + (0, path_1.basename)((0, path_1.dirname)(fileRelativePath)) + "/frontend";
}
/**
 * Configuration schema for TECLegacyBlocksFrontendPostCss.
 *
 * @type {ConfigurationSchema}
 * @property {string[]} fileExtensions - The file extensions to match, in this case only `.pcss`.
 * @property {function} fileMatcher - Function to match specific files.
 * @property {function} entryPointName - Function to generate the entry point name based on file path.
 */
exports.TECLegacyBlocksFrontendPostCss = {
    fileExtensions: [".pcss"], // Only match `.pcss` files.
    fileMatcher,
    entryPointName,
};
