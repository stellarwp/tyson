"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TECLegacyJs = void 0;
const buildExternalName_1 = require("../functions/buildExternalName");
function fileMatcher({ fileName, fileRelativePath, }) {
    return !(fileName.endsWith(".min.js") || fileRelativePath.includes("__tests__"));
}
function entryPointName({ fileRelativePath }) {
    return "js/" + fileRelativePath.replace(/\.js$/, "");
}
function expose({ entryPointName, fileAbsolutePath, }) {
    // From 'js/customizer-views-v2-live-preview' to  'tec.customizerViewsV2LivePreview'.
    // From 'js/tec-update-6.0.0-notice' to 'tec.tecUpdate600Notice'.
    return fileAbsolutePath.match(/frontend\.js$/)
        ? false
        : (0, buildExternalName_1.buildExternalName)("tec", entryPointName, ["js"]);
}
exports.TECLegacyJs = {
    fileExtensions: [".js"],
    fileMatcher,
    entryPointName,
    expose,
};
