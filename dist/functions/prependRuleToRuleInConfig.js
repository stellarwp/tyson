"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prependRuleToRuleInConfig = prependRuleToRuleInConfig;
/**
 * Prepends a rule to another rule in the WebPack configuration.
 *
 * @param {WebPackConfiguration} config  WebPack configuration.
 * @param {WebPackRule} rule    Rule to prepend.
 * @param {function(rule: string): boolean} ruleMatcher A function that will be used to find the rule to prepend the
 *     rule to.
 *
 * @return {void} The configuration is modified in place.
 */
function prependRuleToRuleInConfig(config, rule, ruleMatcher) {
    // Run direct access on the configuration: if the schema does not match this should crash.
    const ruleIndex = config.module.rules.findIndex(ruleMatcher);
    if (ruleIndex === undefined) {
        throw new Error("No matching rule found");
    }
    config.module.rules.splice(ruleIndex, 0, rule);
}
