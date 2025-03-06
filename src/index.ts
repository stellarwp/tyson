import {
  TECLegacyBlocksFrontendPostCss,
  TECLegacyJs,
  TECPackage,
  TECPostCss,
} from "./schema";
import {
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
} from "./functions";
import { WindowAssignPropertiesPlugin } from "./webpack";

// This acts as a façade that will re-export everything on the module.
export {
  TECLegacyJs,
  TECPostCss,
  TECLegacyBlocksFrontendPostCss,
  TECPackage,
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
  WindowAssignPropertiesPlugin,
};
