"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TECLegacyJs = void 0;
const buildExternalName_1 = require("../functions/buildExternalName");
/**
 * Determines if a file should be included based on its name and path.
 *
 * @param {FileCallbackArguments} args - The arguments containing the file name and relative path.
 * @returns {boolean} - Returns true if the file should be included, false otherwise.
 */
function fileMatcher({ fileName, fileRelativePath, }) {
    return !(fileName.endsWith(".min.js") || fileRelativePath.includes("__tests__"));
}
/**
 * Generates an entry point name for a given file path.
 *
 * @param {FileCallbackArguments} args - The arguments containing the relative file path.
 * @returns {string} - The generated entry point name.
 */
function entryPointName({ fileRelativePath }) {
    return "js" + fileRelativePath.replace(/\.js$/, "");
}
/**
 * Determines if a file should be exposed and generates an external name for it.
 *
 * @param {ExposeCallbackArguments} args - The arguments containing the entry point name and absolute file path.
 * @returns {string | false} - Returns the external name if the file should be exposed, false otherwise.
 */
function expose({ entryPointName, fileAbsolutePath, }) {
    // From 'js/customizer-views-v2-live-preview' to  'tec.customizerViewsV2LivePreview'.
    // From 'js/tec-update-6.0.0-notice' to 'tec.tecUpdate600Notice'.
    return fileAbsolutePath.match(/frontend\.js$/)
        ? false
        : (0, buildExternalName_1.buildExternalName)("tec", entryPointName, ["js"]);
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
exports.TECLegacyJs = {
    fileExtensions: [".js"],
    fileMatcher,
    entryPointName,
    expose,
};
