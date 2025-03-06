import { WebPackConfiguration } from "../types/WebPackConfiguration";
import { modifyRulesInConfig } from "./modifyRulesInConfig";
import { PostcssUseEntry, UseEntry, WebPackRule } from "../types/WebPackRule";
import { ruleUsesLoader } from "./ruleUsesLoader";
import { usesLoader } from "./usesLoader";

/**
 * Returns whether a Webpack configuration rule is using PostCSS laoder or not.
 *
 * @param {WebPackRule} rule The WebPack rule to check.
 *
 * @return {boolean} Whether the rule uses PostCSS loader or not.
 */
function isPostcssLoaderRule(rule: WebPackRule): boolean {
  return (
    String(rule.test) === String(/\.pcss$/) &&
    ruleUsesLoader(rule, "postcss-loader")
  );
}

/**
 * Returns whether a `use` entry part of a rule uses PostCSS loader or not.
 *
 * @param {UseEntry} useEntry The use entry to check.
 *
 * @return {boolean} Whether the use entry uses PostCSS loader or not.
 */
function useEntryUsesPostcssLoader(useEntry: UseEntry): boolean {
  return typeof useEntry === "string"
    ? usesLoader(useEntry, "postcss-loader")
    : usesLoader(useEntry?.loader || "", "postcss-loader");
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
function modifyPostcssLoaderRule(
  rule: WebPackRule,
  plugins: string[],
): WebPackRule {
  const useEntries = Array.isArray(rule.use) ? rule.use : [rule.use];
  const prependPostcssPlugins = function (
    useEntry: PostcssUseEntry,
  ): PostcssUseEntry {
    if (!useEntryUsesPostcssLoader(useEntry)) {
      return useEntry;
    }

    if (typeof useEntry === "string") {
      // Make the use entry an object.
      useEntry = {
        loader: useEntry,
        options: { postcssOptions: { plugins: [] } },
      };
    } else {
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
export function preprocessPostcssWithPlugins(
  config: WebPackConfiguration,
  plugins: string[],
): void {
  if (typeof config !== "object") {
    throw new Error(
      "Invalid configuration provided. Configuration must be an object.",
    );
  }

  if (!Array.isArray(plugins)) {
    throw new Error(
      "Invalid plugin set provided. Plugin set must be an array of strings.",
    );
  }

  modifyRulesInConfig(
    config,
    isPostcssLoaderRule,
    (rule: WebPackRule): WebPackRule => modifyPostcssLoaderRule(rule, plugins),
  );
}
