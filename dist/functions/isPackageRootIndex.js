"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPackageRootIndex = isPackageRootIndex;
exports.addToDiscoveredPackageRoots = addToDiscoveredPackageRoots;
const path_1 = require("path");
/**
 * A list of package roots discovered so far.
 *
 * @type {string[]}
 */
const discoveredPackageRoots = [];
/**
 * Returns whether a file is a package index file or not.
 * Package index files are index files that are not found in sub-directories of previously discovered packages.
 * This function leverages the fact that the node `readdir` function will scan directories depth-first.
 *
 * @param {string} fileRelativePath The file path relative to the schema location.
 *
 * @returns {boolean} Whether the file is a package index file or not.
 */
function isPackageRootIndex(fileRelativePath) {
    const dirFrags = (0, path_1.dirname)(fileRelativePath)
        .split("/")
        .filter((frag) => frag !== "")
        .reverse();
    let curDir = dirFrags.pop();
    let prevDir = null;
    while (dirFrags.length !== 0 && prevDir !== curDir) {
        if (discoveredPackageRoots.includes(curDir)) {
            return false;
        }
        prevDir = curDir;
        curDir += "/" + dirFrags.pop();
    }
    return true;
}
function addToDiscoveredPackageRoots(packageRoot) {
    discoveredPackageRoots.push(packageRoot);
}
