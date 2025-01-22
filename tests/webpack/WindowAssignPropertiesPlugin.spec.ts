import { RawSource, Source } from "webpack-sources";
import { WindowAssignPropertiesPlugin } from "../../src";
import { WindowAssignPropertiesPluginOptions } from "../../src/types/WindowAssignPropertiesPluginOptions";

describe("WindowAssignPropertiesPlugin", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  describe("constructor", () => {
    test("should use default options if no options are provided", () => {
      const plugin = new WindowAssignPropertiesPlugin();
      expect(plugin.getOptions()).toEqual(
        WindowAssignPropertiesPlugin.defaultOptions,
      );
    });

    test("should merge user options with default options", () => {
      const customOptions: WindowAssignPropertiesPluginOptions = {
        webPackLineStart: "customPrefix",
      };
      const plugin = new WindowAssignPropertiesPlugin(customOptions);
      expect(plugin.getOptions()).toEqual({
        ...WindowAssignPropertiesPlugin.defaultOptions,
        ...customOptions,
      });
    });

    test("should throw an error if invalid options are provided", () => {
      const invalidOptions: any = { webPackLineStart: 123 };
      expect(() => new WindowAssignPropertiesPlugin(invalidOptions)).toThrow();
    });
  });

  describe("apply", () => {
    test("should tap into the compilation and processAssets hooks", () => {
      const compilerMock = {
        webpack: { Compilation: { PROCESS_ASSETS_STAGE_ADDITION: 1 } },
        hooks: {
          compilation: { tap: jest.fn() },
        },
      };

      const plugin = new WindowAssignPropertiesPlugin();
      plugin.apply(compilerMock);

      expect(compilerMock.hooks.compilation.tap).toHaveBeenCalledWith(
        "WindowAssignPropertiesPlugin",
        expect.any(Function),
      );

      const compilationHookFn =
        compilerMock.hooks.compilation.tap.mock.calls[0][1];
      const compilationMock = {
        hooks: {
          processAssets: { tap: jest.fn() },
        },
      };
      compilationHookFn(compilationMock);

      expect(compilationMock.hooks.processAssets.tap).toHaveBeenCalledWith(
        {
          name: "WindowAssignPropertiesPlugin",
          stage: 1,
        },
        expect.any(Function),
      );
    });
  });

  describe("updateAssetSource", () => {
    test("should update the source with window assignments", () => {
      const plugin = new WindowAssignPropertiesPlugin();
      const sourceMock: Source = {
        source: () => `window["__tyson_window.acme.product.feature.package"]`,
      };
      const updatedSource = plugin.updateAssetSource(sourceMock);

      expect(updatedSource.source())
        .toBe(`window['acme'] = window['acme'] || {};
/******/        window['acme']['product'] = window['acme']['product'] || {};
/******/        window['acme']['product']['feature'] = window['acme']['product']['feature'] || {};
/******/        window['acme']['product']['feature']['package']`);
    });

    test("should handle ArrayBuffer input", () => {
      const plugin = new WindowAssignPropertiesPlugin();
      const sourceMock: Source = {
        source: () =>
          new TextEncoder().encode(
            `window["__tyson_window.acme.product.feature.package"]`,
          ),
      };
      const updatedSource = plugin.updateAssetSource(sourceMock);

      expect(updatedSource.source())
        .toBe(`window['acme'] = window['acme'] || {};
/******/        window['acme']['product'] = window['acme']['product'] || {};
/******/        window['acme']['product']['feature'] = window['acme']['product']['feature'] || {};
/******/        window['acme']['product']['feature']['package']`);
    });
  });

  describe("processAssets", () => {
    test("should update assets with the correct source", () => {
      const plugin = new WindowAssignPropertiesPlugin();
      const assetMock: Source = {
        source: () => `window["__tyson_window.acme.product.feature.package"]`,
      };
      const assets = { "index.js": assetMock };

      plugin.processAssets(assets);

      expect((assets["index.js"] as RawSource).source())
        .toBe(`window['acme'] = window['acme'] || {};
/******/        window['acme']['product'] = window['acme']['product'] || {};
/******/        window['acme']['product']['feature'] = window['acme']['product']['feature'] || {};
/******/        window['acme']['product']['feature']['package']`);
    });

    test("should not update non-js assets", () => {
      const plugin = new WindowAssignPropertiesPlugin();
      const assetMock: Source = {
        source: () => `window["__tyson_window.acme.product.feature.package"]`,
      };
      const assets = { "index.html": assetMock };

      plugin.processAssets(assets);

      expect((assets["index.html"] as RawSource).source()).toBe(
        `window["__tyson_window.acme.product.feature.package"]`,
      );
    });
  });
});
