"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TECPackage = void 0;
const path_1 = require("path");
const isPackageRootIndex_1 = require("../functions/isPackageRootIndex");
/**
 * Determines if a file should be matched based on specific criteria.
 *
 * @param {FileCallbackArguments} args - The arguments containing file information.
 * @returns {boolean} - True if the file matches the criteria, false otherwise.
 */
function fileMatcher({ fileAbsolutePath, fileName, fileRelativePath, }) {
    return (!fileAbsolutePath.includes("__tests__") &&
        fileName.match(/index\.(js|jsx|ts|tsx)$/) &&
        (0, isPackageRootIndex_1.isPackageRootIndex)(fileRelativePath));
}
/**
 * Generates the entry point name for a given file.
 *
 * @param {FileCallbackArguments} args - The arguments containing file information.
 * @returns {string} - The directory name of the file's relative path.
 */
function entryPointName({ fileRelativePath }) {
    (0, isPackageRootIndex_1.addToDiscoveredPackageRoots)((0, path_1.dirname)(fileRelativePath));
    return (0, path_1.dirname)(fileRelativePath);
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
};
