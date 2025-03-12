"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TECLegacyJs = void 0;
exports.createTECLegacyJs = createTECLegacyJs;
const buildExternalName_1 = require("../functions/buildExternalName");
/**
 * Creates a TECLegacyJs schema with a custom namespace.
 *
 * @param {string|string[]} [namespace="tec"] - The namespace to use for the schema.
 * @returns {ConfigurationSchema} The configured schema.
 */
function createTECLegacyJs(namespace = "tec") {
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
            : (0, buildExternalName_1.buildExternalName)(namespace, entryPointName, ["js"]);
    }
    return {
        fileExtensions: [".js"],
        namespace,
        fileMatcher,
        entryPointName,
        expose,
    };
}
/**
 * Default TECLegacyJs schema with "tec" namespace.
 */
exports.TECLegacyJs = createTECLegacyJs();
