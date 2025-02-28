"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WindowAssignPropertiesPlugin = exports.ruleUsesLoader = exports.prependRuleToRuleInConfig = exports.isPackageRootIndex = exports.exposeEntry = exports.doNotPrefixSVGIdsClasses = exports.compileCustomEntryPoints = exports.buildExternalName = exports.TECPackage = exports.TECLegacyBlocksFrontendPostCss = exports.TECPostCss = exports.TECLegacyJs = void 0;
const schema_1 = require("./schema");
Object.defineProperty(exports, "TECLegacyBlocksFrontendPostCss", { enumerable: true, get: function () { return schema_1.TECLegacyBlocksFrontendPostCss; } });
Object.defineProperty(exports, "TECLegacyJs", { enumerable: true, get: function () { return schema_1.TECLegacyJs; } });
Object.defineProperty(exports, "TECPackage", { enumerable: true, get: function () { return schema_1.TECPackage; } });
Object.defineProperty(exports, "TECPostCss", { enumerable: true, get: function () { return schema_1.TECPostCss; } });
const functions_1 = require("./functions");
Object.defineProperty(exports, "buildExternalName", { enumerable: true, get: function () { return functions_1.buildExternalName; } });
Object.defineProperty(exports, "compileCustomEntryPoints", { enumerable: true, get: function () { return functions_1.compileCustomEntryPoints; } });
Object.defineProperty(exports, "doNotPrefixSVGIdsClasses", { enumerable: true, get: function () { return functions_1.doNotPrefixSVGIdsClasses; } });
Object.defineProperty(exports, "exposeEntry", { enumerable: true, get: function () { return functions_1.exposeEntry; } });
Object.defineProperty(exports, "isPackageRootIndex", { enumerable: true, get: function () { return functions_1.isPackageRootIndex; } });
Object.defineProperty(exports, "prependRuleToRuleInConfig", { enumerable: true, get: function () { return functions_1.prependRuleToRuleInConfig; } });
Object.defineProperty(exports, "ruleUsesLoader", { enumerable: true, get: function () { return functions_1.ruleUsesLoader; } });
const webpack_1 = require("./webpack");
Object.defineProperty(exports, "WindowAssignPropertiesPlugin", { enumerable: true, get: function () { return webpack_1.WindowAssignPropertiesPlugin; } });
