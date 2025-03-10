"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TECPostCss = void 0;
exports.fileMatcher = fileMatcher;
exports.entryPointName = entryPointName;
exports.modifyConfig = modifyConfig;
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
 * @returns {string} - The generated entry point name with ".pcss" replaced by an empty string and prefixed with "css/".
 */
function entryPointName({ fileRelativePath, }) {
    return "css/" + fileRelativePath.replace(".pcss", "");
}
/**
 * Modifies the WebPack configuration to include a rule for processing PostCSS files in the `src/modules` directory.
 * The rule uses the `postcss-loader` with the `postcss-nested` plugin to handle nesting syntax.
 * PostCSS files in the `src/modules` directory use PostCSS nesting, where `&` indicates "this".
 * By default WordPress scripts would use new CSS nesting syntax where `&` indicates the parent.
 * We add here the `postcss-nested` plugin to allow the use of `&` to mean "this".
 * In webpack loaders are applied in LIFO order: this will prepare the PostCSS for the default `postcss-loader`.
 *
 * @param {WebPackConfiguration} config - The WebPack configuration object to be modified.
 */
function modifyConfig(config) {
    config.module.rules.push({
        test: /\.pcss$/,
        use: [
            {
                loader: "postcss-loader",
                options: {
                    postcssOptions: {
                        plugins: ["postcss-nested"],
                    },
                },
            },
        ],
        type: "javascript/auto",
    });
}
/**
 * Configuration schema for handling PostCSS files with specific rules and modifications.
 * @type {ConfigurationSchema}
 */
exports.TECPostCss = {
    fileExtensions: [".pcss"],
    fileMatcher,
    entryPointName,
    modifyConfig,
};
