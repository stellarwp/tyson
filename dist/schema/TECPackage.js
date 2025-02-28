"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TECPackage = void 0;
exports.fileMatcher = fileMatcher;
exports.entryPointName = entryPointName;
exports.expose = expose;
const path_1 = require("path");
const isPackageRootIndex_1 = require("../functions/isPackageRootIndex");
const functions_1 = require("../functions");
/**
 * Determines if a file should be matched based on specific criteria.
 *
 * @param {FileCallbackArguments} args - The arguments containing file information.
 * @returns {boolean} - True if the file matches the criteria, false otherwise.
 */
function fileMatcher({ fileAbsolutePath, fileName, fileRelativePath, }) {
    if (fileAbsolutePath.includes("__tests__")) {
        return false;
    }
    return (fileName.match(/index\.(js|jsx|ts|tsx)$/) !== null &&
        (0, isPackageRootIndex_1.isPackageRootIndex)(fileRelativePath));
}
/**
 * Generates the entry point name for a given file.
 *
 * @param {FileCallbackArguments} args - The arguments containing file information.
 * @returns {string} - The directory name of the file's relative path.
 */
function entryPointName({ fileRelativePath, }) {
    (0, isPackageRootIndex_1.addToDiscoveredPackageRoots)((0, path_1.dirname)(fileRelativePath));
    return (0, path_1.dirname)(fileRelativePath);
}
/**
 * Determines if a file should be exposed and generates an external name for it.
 *
 * @param {ExposeCallbackArguments} args - The arguments containing the entry point name and absolute file path.
 * @returns {string | false} - Returns the external name if the file should be exposed, false otherwise.
 */
function expose({ entryPointName, fileAbsolutePath, }) {
    // From 'resources/packages/customizer-views-v2-live-preview' to  'tec.customizerViewsV2LivePreview'.
    // From 'resources/packages/tec-update-6.0.0-notice' to 'tec.tecUpdate600Notice'.
    return (0, functions_1.buildExternalName)("tec", entryPointName, ["js"]);
}
/**
 * Configuration schema for the TEC package.
 *
 * @type {ConfigurationSchema}
 * @property {string[]} fileExtensions - The file extensions to be considered.
 * @property {function} fileMatcher - Function to match files based on specific criteria.
 * @property {function} entryPointName - Function to generate the entry point name for a given file.
 */
exports.TECPackage = {
    fileExtensions: [".js", ".jsx", ".ts", ".tsx"],
    fileMatcher,
    entryPointName,
    expose,
};
