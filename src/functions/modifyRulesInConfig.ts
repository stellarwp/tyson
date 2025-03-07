import { WebPackConfiguration } from "../types/WebPackConfiguration";
import { WebPackRule } from "../types/WebPackRule";

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
export function modifyRulesInConfig(
  config: WebPackConfiguration,
  ruleMatcher: (element: any, index: number, array: any[]) => boolean,
  modifyRule: (rule: WebPackRule) => WebPackRule,
): void {
  config.module.rules = Array.isArray(config?.module?.rules)
    ? config.module.rules
    : [];

  config.module.rules = config.module.rules.map(
    (
      rule: WebPackRule,
      index: number,
      allRules: WebPackRule[],
    ): WebPackRule => {
      if (!ruleMatcher(rule, index, allRules)) {
        return rule;
      }

      return modifyRule(rule);
    },
  );
}
