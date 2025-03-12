import {
  TECLegacyBlocksFrontendPostCss,
  createTECLegacyBlocksFrontendPostCss,
} from "../../src/schema/TECLegacyBlocksFrontendPostCss";
import { FileCallbackArguments } from "../../src/types/FileCallbackArguments";

describe("TECLegacyBlocksFrontendPostCss", () => {
  describe("default instance", () => {
    it("should have the correct file extensions", () => {
      expect(TECLegacyBlocksFrontendPostCss.fileExtensions).toEqual([".pcss"]);
    });

    it("should have the default namespace", () => {
      expect(TECLegacyBlocksFrontendPostCss.namespace).toBe("tec");
    });
  });

  describe("createTECLegacyBlocksFrontendPostCss", () => {
    it("should create a schema with custom string namespace", () => {
      const schema = createTECLegacyBlocksFrontendPostCss("custom");
      expect(schema.namespace).toBe("custom");
    });

    it("should create a schema with custom array namespace", () => {
      const schema = createTECLegacyBlocksFrontendPostCss([
        "custom",
        "namespace",
      ]);
      expect(schema.namespace).toEqual(["custom", "namespace"]);
    });

    it("should use default namespace when none provided", () => {
      const schema = createTECLegacyBlocksFrontendPostCss();
      expect(schema.namespace).toBe("tec");
    });
  });

  describe("fileMatcher", () => {
    it("should exclude files starting with underscore", () => {
      const args: FileCallbackArguments = {
        fileName: "_partial.pcss",
        fileRelativePath: "styles/_partial.pcss",
        fileAbsolutePath: "/abs/path/styles/_partial.pcss",
      };
      expect(TECLegacyBlocksFrontendPostCss.fileMatcher(args)).toBe(false);
    });

    it("should include regular pcss files", () => {
      const args: FileCallbackArguments = {
        fileName: "styles.pcss",
        fileRelativePath: "styles/styles.pcss",
        fileAbsolutePath: "/abs/path/styles/styles.pcss",
      };
      expect(TECLegacyBlocksFrontendPostCss.fileMatcher(args)).toBe(true);
    });
  });

  describe("entryPointName", () => {
    it("should generate correct entry point name", () => {
      const args: FileCallbackArguments = {
        fileName: "styles.pcss",
        fileRelativePath: "feature/styles.pcss",
        fileAbsolutePath: "/abs/path/feature/styles.pcss",
      };
      expect(TECLegacyBlocksFrontendPostCss.entryPointName(args)).toBe(
        "feature/styles",
      );
    });
  });
});
