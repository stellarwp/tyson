import { buildExternalName } from "./buildExternalName";
import { compileCustomEntryPoints } from "./compileCustomEntryPoints";
import { doNotPrefixSVGIdsClasses } from "./doNotPrefixSVGIdsClasses";
import { exposeEntry } from "./exposeEntry";
import { isPackageRootIndex } from "./isPackageRootIndex";
import { prependRuleToRuleInConfig } from "./prependRuleToRuleInConfig";
import { ruleUsesLoader } from "./ruleUsesLoader";
import { modifyRulesInConfig } from "./modifyRulesInConfig";
import { usesLoader } from "./usesLoader";
import { preprocessPostcssWithPlugins } from "./preprocessPostcssWithPlugins";
import { resolveExternalToGlobal } from "./resolveExternalToGlobal";

export {
  buildExternalName,
  compileCustomEntryPoints,
  doNotPrefixSVGIdsClasses,
  exposeEntry,
  isPackageRootIndex,
  prependRuleToRuleInConfig,
  ruleUsesLoader,
  modifyRulesInConfig,
  usesLoader,
  preprocessPostcssWithPlugins,
  resolveExternalToGlobal,
};
