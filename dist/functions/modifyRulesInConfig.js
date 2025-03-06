"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.modifyRulesInConfig = modifyRulesInConfig;
/**
 * Modifies a set of matching rules in the WebPack configuration in place.
 *
 * @param config The WebPack configuration to modify.
 * @param {function (element: any, index: number, array: any[]) => boolean } ruleMatcher The function that will be used
 *     to find matching rules.
 * @param {function(rule: WebPackRule) => WebPackRule} modifyRule The function that will be called on each matching rule to
 *     modify it.
 *
 * @returns {void}  The matching rules in the configuration are modified in place.
 */
function modifyRulesInConfig(config, ruleMatcher, modifyRule) {
    config.module.rules = Array.isArray(config?.module?.rules)
        ? config.module.rules
        : [];
    config.module.rules = config.module.rules.map((rule, index, allRules) => {
        if (!ruleMatcher(rule, index, allRules)) {
            return rule;
        }
        return modifyRule(rule);
    });
}
