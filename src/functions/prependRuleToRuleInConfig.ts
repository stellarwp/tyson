import { WebPackConfiguration } from "../types/WebPackConfiguration";
import { WebPackRule } from "../types/WebPackRule";

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
export function prependRuleToRuleInConfig(
  config: WebPackConfiguration,
  rule: WebPackRule,
  ruleMatcher: (element: any, index: number, array: any[]) => boolean,
): void {
  // Run direct access on the configuration: if the schema does not match this should crash.
  const rules = Array.isArray(config?.module?.rules) ? config.module.rules : [];
  const ruleIndex = rules.findIndex(ruleMatcher);

  if (ruleIndex === -1) {
    throw new Error("No matching rule found");
  }

  config.module.rules.splice(ruleIndex, 0, rule);
}
