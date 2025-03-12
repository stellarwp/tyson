"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TECLegacyBlocksFrontendPostCss = void 0;
exports.createTECLegacyBlocksFrontendPostCss = createTECLegacyBlocksFrontendPostCss;
/**
 * Creates a TECLegacyBlocksFrontendPostCss schema with a custom namespace.
 *
 * @param {string|string[]} [namespace="tec"] - The namespace to use for the schema.
 * @returns {ConfigurationSchema} The configured schema.
 */
function createTECLegacyBlocksFrontendPostCss(namespace = "tec") {
    /**
     * Determines if a file should be included based on its name.
     * @param {FileCallbackArguments} args - The arguments containing the file name.
     * @returns {boolean} - True if the file name does not start with "_", otherwise false.
     */
    function fileMatcher({ fileName }) {
        return !fileName.startsWith("_");
    }
    /**
     * Generates an entry point name for a given file path.
     * @param {FileCallbackArguments} args - The arguments containing the relative file path.
     * @returns {string} - The generated entry point name with ".pcss" replaced by an empty string.
     */
    function entryPointName({ fileRelativePath }) {
        return fileRelativePath.replace(".pcss", "");
    }
    return {
        fileExtensions: [".pcss"],
        namespace,
        fileMatcher,
        entryPointName,
    };
}
/**
 * Default TECLegacyBlocksFrontendPostCss schema with "tec" namespace.
 */
exports.TECLegacyBlocksFrontendPostCss = createTECLegacyBlocksFrontendPostCss();
