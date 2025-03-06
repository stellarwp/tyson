"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.modifyRuleInConfig = modifyRuleInConfig;
/**
 * Modifies a set of matching rules in the WebPack configuration in place.
 *
 * @param config The WebPack configuraiton to modify.
 * @param {function (element: any, index: number, array: any[]) => boolean } ruleMatcher The function that will be used
 *     to find matching rules.
 * @param {function(rule: WebPackRule) => void} modifyRule The function that will be called on each matching rule to
 *     modify it.
 */
function modifyRuleInConfig(config, ruleMatcher, modifyRule) {
    const rules = Array.isArray(config?.module?.rules) ? config.module.rules : [];
    rules.filter(ruleMatcher).forEach(modifyRule);
}
