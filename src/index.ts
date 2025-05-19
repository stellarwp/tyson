import {
  TECLegacyBlocksFrontendPostCss,
  createTECLegacyBlocksFrontendPostCss,
  TECLegacyJs,
  createTECLegacyJs,
  TECPackage,
  createTECPackage,
  TECPostCss,
  createTECPostCss,
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
  resolveExternalToGlobal,
} from "./functions";
import { WindowAssignPropertiesPlugin } from "./webpack";

// This acts as a façade that will re-export everything on the module.
export {
  TECLegacyJs,
  createTECLegacyJs,
  TECPostCss,
  createTECPostCss,
  TECLegacyBlocksFrontendPostCss,
  createTECLegacyBlocksFrontendPostCss,
  TECPackage,
  createTECPackage,
  buildExternalName,
  compileCustomEntryPoints,
  doNotPrefixSVGIdsClasses,
  exposeEntry,
  isPackageRootIndex,
  prependRuleToRuleInConfig,
  resolveExternalToGlobal,
  ruleUsesLoader,
  modifyRulesInConfig,
  usesLoader,
  preprocessPostcssWithPlugins,
  WindowAssignPropertiesPlugin,
};
