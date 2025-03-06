"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.preprocessPostcssWithPlugins = preprocessPostcssWithPlugins;
const modifyRulesInConfig_1 = require("./modifyRulesInConfig");
const ruleUsesLoader_1 = require("./ruleUsesLoader");
const usesLoader_1 = require("./usesLoader");
/**
 * Returns whether a Webpack configuration rule is using PostCSS laoder or not.
 *
 * @param {WebPackRule} rule The WebPack rule to check.
 *
 * @return {boolean} Whether the rule uses PostCSS loader or not.
 */
function isPostcssLoaderRule(rule) {
    return (String(rule.test) === String(/\.pcss$/) &&
        (0, ruleUsesLoader_1.ruleUsesLoader)(rule, "postcss-loader"));
}
/**
 * Returns whether a `use` entry part of a rule uses PostCSS loader or not.
 *
 * @param {UseEntry} useEntry The use entry to check.
 *
 * @return {boolean} Whether the use entry uses PostCSS loader or not.
 */
function useEntryUsesPostcssLoader(useEntry) {
    return typeof useEntry === "string"
        ? (0, usesLoader_1.usesLoader)(useEntry, "postcss-loader")
        : (0, usesLoader_1.usesLoader)(useEntry?.loader || "", "postcss-loader");
}
/**
 * Modifies a rule using PostCSS loader to prepend a set of plugins before any other plugin used to
 * process PostCSS files.
 *
 * @param {WebPackRule} rule The rule to modify in place.
 * @param {string[]} plugins The set of plugins to prepend.
 *
 * @return {void} The rule is updated in place.
 */
function modifyPostcssLoaderRule(rule, plugins) {
    const useEntries = Array.isArray(rule.use) ? rule.use : [rule.use];
    const prependPostcssPlugins = function (useEntry) {
        if (!useEntryUsesPostcssLoader(useEntry)) {
            return useEntry;
        }
        if (typeof useEntry === "string") {
            // Make the use entry an object.
            useEntry = {
                loader: useEntry,
                options: { postcssOptions: { plugins: [] } },
            };
        }
        else {
            // Ensure the use entry has a options.postcssOptions.plugins property.
            useEntry.options = useEntry.options || {};
            useEntry.options.postcssOptions = useEntry.options.postcssOptions || {
                plugins: [],
            };
            useEntry.options.postcssOptions.plugins =
                useEntry.options.postcssOptions.plugins || [];
        }
        useEntry.options.postcssOptions.plugins = [
            ...plugins,
            ...useEntry.options.postcssOptions.plugins,
        ];
        return useEntry;
    };
    rule.use = useEntries.map(prependPostcssPlugins);
    return rule;
}
/**
 * Modifies a rule using PostCSS loader to prepend a set of plugins before any other plugin used to
 * process PostCSS files.
 *
 * @param {WebPackConfiguration} config The WebPack configuration to modify in place.
 * @param {string[]} plugins The set of plugins to prepend.
 *
 * @return {void} The configuration is updated in place.
 *
 * @throws {Error} If the 'plugins' argument is not an array of strings.
 */
function preprocessPostcssWithPlugins(config, plugins) {
    if (typeof config !== "object") {
        throw new Error("Invalid configuration provided. Configuration must be an object.");
    }
    if (!Array.isArray(plugins)) {
        throw new Error("Invalid plugin set provided. Plugin set must be an array of strings.");
    }
    (0, modifyRulesInConfig_1.modifyRulesInConfig)(config, isPostcssLoaderRule, (rule) => modifyPostcssLoaderRule(rule, plugins));
}
