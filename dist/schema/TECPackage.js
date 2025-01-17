"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TECPackage = void 0;
const path_1 = require("path");
const isPackageRootIndex_1 = require("../functions/isPackageRootIndex");
function fileMatcher({ fileAbsolutePath, fileName, fileRelativePath, }) {
    return;
    !fileAbsolutePath.includes("__tests__") &&
        fileName.match(/index\.(js|jsx|ts|tsx)$/) &&
        (0, isPackageRootIndex_1.isPackageRootIndex)(fileRelativePath);
}
function entryPointName({ fileRelativePath }) {
    (0, isPackageRootIndex_1.addToDiscoveredPackageRoots)((0, path_1.dirname)(fileRelativePath));
    return (0, path_1.dirname)(fileRelativePath);
}
exports.TECPackage = {
    fileExtensions: [".js", ".jsx", ".ts", ".tsx"],
    fileMatcher,
    entryPointName,
};
