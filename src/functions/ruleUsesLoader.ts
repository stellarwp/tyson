import { WebPackRule } from "../types/WebPackRule";
import { usesLoader } from "./usesLoader";

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
export function ruleUsesLoader(rule: WebPackRule, loader: string): boolean {
  if (!rule.use) {
    // Not all rules will define a `use` property, so we can simply return false here.
    return false;
  }

  return usesLoader(rule.use, loader);
}
