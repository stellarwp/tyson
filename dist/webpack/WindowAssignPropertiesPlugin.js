"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WindowAssignPropertiesPlugin = void 0;
const webpack_sources_1 = require("webpack-sources");
class WindowAssignPropertiesPlugin {
    static defaultOptions = {
        name: "WindowAssignPropertiesPlugin",
        webPackLineStart: "/******/        ",
    };
    options;
    constructor(options = {}) {
        this.options = {
            ...WindowAssignPropertiesPlugin.defaultOptions,
            ...options,
        };
        if (typeof this.options.webPackLineStart !== "string") {
            throw new Error("WebPack Line Start must be a string");
        }
    }
    getOptions() {
        return this.options;
    }
    apply(compiler) {
        const pluginName = WindowAssignPropertiesPlugin.name;
        compiler.hooks.compilation.tap(pluginName, (compilation) => {
            compilation.hooks.processAssets.tap({
                name: pluginName,
                stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITION,
            }, (assets) => this.processAssets(assets));
        });
    }
    updateAssetSource(source) {
        let originalSource = source.source();
        const lineStart = this.options.webPackLineStart;
        if (typeof originalSource !== "string") {
            // Convert from ArrayBuffer to string.
            originalSource = new TextDecoder("utf-8").decode(originalSource);
        }
        const updatedSource = originalSource.replace(/window\["__tyson_window\.(?<path>[^\]]*?)"]/gi, function (match, path) {
            // From `acme.product.feature.package` to `['acme', 'product', 'feature', 'package']`.
            const pathFrags = path.split(".");
            // To `['acme']['product']['feature']['package']`.
            const arrayPath = pathFrags
                .map((pathFrag) => `['${pathFrag}']`)
                .join("");
            /*
             * window['acme'] = window['acme'] || {};
             * window['acme']['product'] = window['acme']['product'] || {};
             * window['acme']['product']['feature'] = window['acme']['product']['feature'] || {};
             * window['acme']['product']['feature']['package'] = __webpack_exports__;
             */
            const assignments = pathFrags
                .slice(0, -1)
                .map((value, index, array) => {
                const windowPath = array
                    .slice(0, index + 1)
                    .map((p) => `['${p}']`)
                    .join("");
                return `window${windowPath} = window${windowPath} || {};`;
            })
                .join(`\n${lineStart}`);
            return `${assignments}\n${lineStart}window${arrayPath}`;
        });
        const newSource = new webpack_sources_1.RawSource(updatedSource);
        /**
         * Hack: depending on the loaded `webpack-sources` package, the `RawSource` class definition might contain or not
         * the `buffer` and `isBuffer` methods. If the class does not contain them, then we polyfill them.
         */
        if (typeof newSource.buffer !== "function") {
            newSource.buffer = () => Buffer.from(updatedSource, "utf-8");
        }
        if (typeof newSource.isBuffer !== "function") {
            newSource.isBuffer = () => true;
        }
        return newSource;
    }
    processAssets(assets) {
        Object.entries(assets).forEach(([pathname, source]) => {
            if (!pathname.match(/(t|j)sx?$/)) {
                return;
            }
            assets[pathname] = this.updateAssetSource(source);
        });
    }
}
exports.WindowAssignPropertiesPlugin = WindowAssignPropertiesPlugin;
