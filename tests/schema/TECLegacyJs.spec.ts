import { TECLegacyJs, createTECLegacyJs } from "../../src/schema/TECLegacyJs";
import { FileCallbackArguments } from "../../src/types/FileCallbackArguments";
import { ExposeCallbackArguments } from "../../src/types/ExposeCallbackArguments";

describe("TECLegacyJs", () => {
  describe("default instance", () => {
    it("should have the correct file extensions", () => {
      expect(TECLegacyJs.fileExtensions).toEqual([".js"]);
    });

    it("should have the default namespace", () => {
      expect(TECLegacyJs.namespace).toBe("tec");
    });
  });

  describe("createTECLegacyJs", () => {
    it("should create a schema with custom string namespace", () => {
      const schema = createTECLegacyJs("custom");
      expect(schema.namespace).toBe("custom");
    });

    it("should create a schema with custom array namespace", () => {
      const schema = createTECLegacyJs(["custom", "namespace"]);
      expect(schema.namespace).toEqual(["custom", "namespace"]);
    });

    it("should use default namespace when none provided", () => {
      const schema = createTECLegacyJs();
      expect(schema.namespace).toBe("tec");
    });
  });

  describe("fileMatcher", () => {
    it("should exclude minified files", () => {
      const args: FileCallbackArguments = {
        fileName: "script.min.js",
        fileRelativePath: "/path/to/script.min.js",
        fileAbsolutePath: "/abs/path/to/script.min.js",
      };
      expect(TECLegacyJs.fileMatcher(args)).toBe(false);
    });

    it("should exclude test files", () => {
      const args: FileCallbackArguments = {
        fileName: "script.js",
        fileRelativePath: "/path/to/__tests__/script.js",
        fileAbsolutePath: "/abs/path/to/__tests__/script.js",
      };
      expect(TECLegacyJs.fileMatcher(args)).toBe(false);
    });

    it("should include regular js files", () => {
      const args: FileCallbackArguments = {
        fileName: "script.js",
        fileRelativePath: "/path/to/script.js",
        fileAbsolutePath: "/abs/path/to/script.js",
      };
      expect(TECLegacyJs.fileMatcher(args)).toBe(true);
    });
  });

  describe("entryPointName", () => {
    it("should generate correct entry point name", () => {
      const args: FileCallbackArguments = {
        fileName: "script.js",
        fileRelativePath: "/path/to/script.js",
        fileAbsolutePath: "/abs/path/to/script.js",
      };
      expect(TECLegacyJs.entryPointName(args)).toBe("js/path/to/script");
    });
  });

  describe("expose", () => {
    it("should not expose frontend.js files", () => {
      const args: ExposeCallbackArguments = {
        entryPointName: "js/path/to/frontend",
        fileAbsolutePath: "/abs/path/to/frontend.js",
        fileName: "frontend.js",
        fileRelativePath: "/path/to/frontend.js",
      };
      expect(TECLegacyJs.expose).toBeDefined();
      expect(TECLegacyJs.expose!(args)).toBe(false);
    });

    it("should expose non-frontend files with default namespace", () => {
      const args: ExposeCallbackArguments = {
        entryPointName: "js/path/to/script",
        fileAbsolutePath: "/abs/path/to/script.js",
        fileName: "script.js",
        fileRelativePath: "/path/to/script.js",
      };
      expect(TECLegacyJs.expose).toBeDefined();
      expect(TECLegacyJs.expose!(args)).toBe("tec.path.to.script");
    });

    it("should expose non-frontend files with custom string namespace", () => {
      const schema = createTECLegacyJs("custom");
      const args: ExposeCallbackArguments = {
        entryPointName: "js/path/to/script",
        fileAbsolutePath: "/abs/path/to/script.js",
        fileName: "script.js",
        fileRelativePath: "/path/to/script.js",
      };
      expect(schema.expose).toBeDefined();
      expect(schema.expose!(args)).toBe("custom.path.to.script");
    });

    it("should expose non-frontend files with custom array namespace", () => {
      const schema = createTECLegacyJs(["custom", "namespace"]);
      const args: ExposeCallbackArguments = {
        entryPointName: "js/path/to/script",
        fileAbsolutePath: "/abs/path/to/script.js",
        fileName: "script.js",
        fileRelativePath: "/path/to/script.js",
      };
      expect(schema.expose).toBeDefined();
      expect(schema.expose!(args)).toBe("custom.namespace.path.to.script");
    });
  });
});
