"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TECLegacyBlocksFrontendPostCss = void 0;
const path_1 = require("path");
function fileMatcher({ fileName }) {
    return fileName === "frontend.pcss";
}
function entryPointName({ fileRelativePath }) {
    return "app/" + (0, path_1.basename)((0, path_1.dirname)(fileRelativePath)) + "/frontend";
}
exports.TECLegacyBlocksFrontendPostCss = {
    fileExtensions: [".pcss"],
    fileMatcher,
    entryPointName,
};
