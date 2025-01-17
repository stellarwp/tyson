import { validate } from "schema-utils";
import { RawSource, Source } from "webpack-sources";

const schema = {
	type: "object",
	properties: {
		webPackLineStart: {
			type: "string",
			description:
				"The line prefix that will be used to start the line in the compiled file.",
		},
	},
	additionalProperties: false,
};

export class WindowAssignPropertiesPlugin {
	static defaultOptions = {
		name: "WindowAssignPropertiesPlugin",
		webPackLineStart: "/******/        ",
	};

	private options: { name: string; webPackLineStart: string };

	constructor(options = {}) {
		validate(options, schema, {
			name: WindowAssignPropertiesPlugin.name,
			baseDataPath: "options",
		});
		this.options = {
			...WindowAssignPropertiesPlugin.defaultOptions,
			...options,
		};
	}

	public apply(compiler) {
		const pluginName = WindowAssignPropertiesPlugin.name;

		compiler.hooks.compilation.tap(pluginName, (compilation) => {
			compilation.hooks.processAssets.tap(
				{
					name: pluginName,
					stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITION,
				},
				(assets: { [key in string]: Source }): void =>
					this.processAssets(assets),
			);
		});
	}

	public updateAssetSource(source: Source): RawSource {
		let originalSource = source.source();
		const lineStart = this.options.webPackLineStart;

		if (typeof originalSource !== "string") {
			// Convert from ArrayBuffer to string.
			originalSource = new TextDecoder("utf-8").decode(originalSource);
		}

		const updatedSource = originalSource.replace(
			/window\["__tyson_window\.(?<path>[^\]]*?)"]/gi,
			function (match: string, path: string): string {
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
			},
		);

		return new RawSource(updatedSource);
	}

	public processAssets(assets: { [key in string]: Source }) {
		Object.entries(assets).forEach(([pathname, source]) => {
			if (!pathname.match(/(t|j)sx?$/)) {
				return;
			}
			assets[pathname] = this.updateAssetSource(source);
		});
	}
}
