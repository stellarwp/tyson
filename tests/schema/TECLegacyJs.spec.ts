import { FileCallbackArguments } from "../../src/types/FileCallbackArguments";
import {
  entryPointName,
  expose,
  fileMatcher,
  TECLegacyJs,
} from "../../src/schema/TECLegacyJs";
import { ExposeCallbackArguments } from "../../src/types/ExposeCallbackArguments";
import { ConfigurationSchema } from "../../src/types/ConfigurationSchema";

describe("TECLegacyBlocksFrontendPostCss", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  describe("fileMatcher", () => {
    it("returns false if file name ends with .min.js", () => {
      const args: FileCallbackArguments = {
        fileName: "example.min.js",
        fileRelativePath: "path/to/example.min.js",
        fileAbsolutePath: "/users/bob/project/path/to/example.min.js",
      };
      expect(fileMatcher(args)).toBe(false);
    });

    it("returns false if file relative path includes __tests__", () => {
      const args: FileCallbackArguments = {
        fileName: "example.js",
        fileRelativePath: "path/__tests__/example.js",
        fileAbsolutePath: "/users/bob/project/path/__tests__/example.js",
      };
      expect(fileMatcher(args)).toBe(false);
    });

    it("returns true for other cases", () => {
      const args: FileCallbackArguments = {
        fileName: "example.js",
        fileRelativePath: "path/to/example.js",
        fileAbsolutePath: "/users/bob/project/path/to/example.js",
      };
      expect(fileMatcher(args)).toBe(true);
    });
  });

  describe("entryPointName", () => {
    it("removes .js extension from the file relative path", () => {
      const args: FileCallbackArguments = {
        fileName: "example.js",
        fileRelativePath: "/path/to/example.js",
        fileAbsolutePath: "/users/bob/project/path/to/example.js",
      };
      expect(entryPointName(args)).toBe("js/path/to/example");
    });

    it("handles paths without .js extension gracefully", () => {
      const args: FileCallbackArguments = {
        fileName: "example",
        fileRelativePath: "/path/to/example",
        fileAbsolutePath: "/users/bob/project/path/to/example.js",
      };
      expect(entryPointName(args)).toBe("js/path/to/example");
    });
  });

  describe("expose", () => {
    it("returns false if file absolute path ends with frontend.js", () => {
      const args: ExposeCallbackArguments = {
        entryPointName: "js/frontend",
        fileName: "frontend",
        fileRelativePath: "/path/to/example",
        fileAbsolutePath: "/users/bob/project/path/to/frontend.js",
      };
      expect(expose(args)).toBe(false);
    });

    it("builds external name correctly for other cases", () => {
      const args: ExposeCallbackArguments = {
        entryPointName: "js/customizer-views-v2-live-preview",
        fileName: "customizer-views-v2-live-preview",
        fileRelativePath: "/path/to/customizer-views-v2-live-preview.js",
        fileAbsolutePath:
          "/users/bob/project/path/to/customizer-views-v2-live-preview.js",
      };
      expect(expose(args)).toBe("tec.customizerViewsV2LivePreview");
    });

    it("drops specified fragments from the path", () => {
      const args: ExposeCallbackArguments = {
        entryPointName: "js/tec-update-6.0.0-notice",
        fileName: "tec-update-6.0.0-notice.js",
        fileRelativePath: "/path/to/tec-update-6.0.0-notice.js",
        fileAbsolutePath:
          "/users/bob/project/path/to/tec-update-6.0.0-notice.js",
      };
      expect(expose(args)).toBe("tec.tecUpdate600Notice");
    });
  });

  describe("TECLegacyJs", () => {
    it("exports the correct ConfigurationSchema", () => {
      const expected: ConfigurationSchema = {
        fileExtensions: [".js"],
        fileMatcher,
        entryPointName,
        expose,
      };
      expect(TECLegacyJs).toEqual(expected);
    });
  });
});
