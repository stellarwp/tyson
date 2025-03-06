"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ruleUsesLoader = ruleUsesLoader;
const usesLoader_1 = require("./usesLoader");
/**
 * Returns whether an object following the `module.rules` WebPack schema configuration format uses a loader or not.
 *
 * The loader could be still unresolved (e.g. `some-loader`) or resolved to an absolute path
 * (e.g. `/home/User/some-loader/dist/index.js`). For this reason the comparison is not a strict ones,
 * but a `loader.includes(candidate)` one.
 *
 * @param {WebPackRule} rule      A rule in the `module.rules` WebPack schema configuration format to check.
 * @param {string} loader    The name of a loader to check.
 *
 * @returns {boolean} Whether the specified rule uses the specified loader or not.
 */
function ruleUsesLoader(rule, loader) {
    if (!rule.use) {
        // Not all rules will define a `use` property, so we can simply return false here.
        return false;
    }
    return (0, usesLoader_1.usesLoader)(rule.use, loader);
}
