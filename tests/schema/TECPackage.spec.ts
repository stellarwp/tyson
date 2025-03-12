import { FileCallbackArguments } from "../../src/types/FileCallbackArguments";
import { TECPackage, createTECPackage } from "../../src/schema/TECPackage";
import { ExposeCallbackArguments } from "../../src/types/ExposeCallbackArguments";
import {
  addToDiscoveredPackageRoots,
  getDiscoveredPackageRoots,
} from "../../src/functions/isPackageRootIndex";

describe("TECPackage", () => {
  describe("default instance", () => {
    it("should have the correct file extensions", () => {
      expect(TECPackage.fileExtensions).toEqual([".js", ".jsx", ".ts", ".tsx"]);
    });

    it("should have the default namespace", () => {
      expect(TECPackage.namespace).toBe("tec");
    });
  });

  describe("createTECPackage", () => {
    it("should create a schema with custom string namespace", () => {
      const schema = createTECPackage("custom");
      expect(schema.namespace).toBe("custom");
    });

    it("should create a schema with custom array namespace", () => {
      const schema = createTECPackage(["custom", "namespace"]);
      expect(schema.namespace).toEqual(["custom", "namespace"]);
    });

    it("should use default namespace when none provided", () => {
      const schema = createTECPackage();
      expect(schema.namespace).toBe("tec");
    });
  });

  describe("fileMatcher", () => {
    beforeEach(() => {
      jest.resetModules();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should return true for an index.js file in the root that is a package root", () => {
      const args: FileCallbackArguments = {
        fileAbsolutePath: "/path/to/index.js",
        fileName: "index.js",
        fileRelativePath: "index.js",
      };
      const match = TECPackage.fileMatcher(args);
      expect(match).toBe(true);
    });

    it("should return false for an index.js file in a subdirectory that is not a package root", () => {
      const args: FileCallbackArguments = {
        fileAbsolutePath: "/path/to/dir/subdir/index.js",
        fileName: "index.js",
        fileRelativePath: "dir/subdir/index.js",
      };
      addToDiscoveredPackageRoots("dir");
      expect(TECPackage.fileMatcher(args)).toBe(false);
    });

    it("should return false for a non-index file", () => {
      const args: FileCallbackArguments = {
        fileAbsolutePath: "/path/to/file.js",
        fileName: "file.js",
        fileRelativePath: "file.js",
      };
      expect(TECPackage.fileMatcher(args)).toBe(false);
    });

    it("should return false if the file is in a __tests__ directory", () => {
      const args: FileCallbackArguments = {
        fileAbsolutePath: "/path/to/__tests__/index.js",
        fileName: "index.js",
        fileRelativePath: "__tests__/index.js",
      };
      expect(TECPackage.fileMatcher(args)).toBe(false);
    });
  });

  describe("entryPointName", () => {
    beforeEach(() => {
      jest.resetModules();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should return the directory name of the file's relative path", () => {
      const args: FileCallbackArguments = {
        fileAbsolutePath: "/path/to/subdir/index.js",
        fileName: "index.js",
        fileRelativePath: "subdir/index.js",
      };
      expect(TECPackage.entryPointName(args)).toBe("subdir");
    });

    it("should add the directory to discovered package roots", () => {
      const args: FileCallbackArguments = {
        fileAbsolutePath: "/path/to/subdir/index.js",
        fileName: "index.js",
        fileRelativePath: "subdir/index.js",
      };
      TECPackage.entryPointName(args);
      expect(getDiscoveredPackageRoots()).toContain("subdir");
    });
  });

  describe("expose", () => {
    beforeEach(() => {
      jest.resetModules();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should expose package with default namespace", () => {
      const args: ExposeCallbackArguments = {
        entryPointName: "packages/feature",
        fileAbsolutePath: "/abs/path/packages/feature/index.js",
        fileName: "index.js",
        fileRelativePath: "packages/feature/index.js",
      };
      expect(TECPackage.expose).toBeDefined();
      expect(TECPackage.expose!(args)).toBe("tec.packages.feature");
    });

    it("should expose package with custom string namespace", () => {
      const schema = createTECPackage("custom");
      const args: ExposeCallbackArguments = {
        entryPointName: "packages/feature",
        fileAbsolutePath: "/abs/path/packages/feature/index.js",
        fileName: "index.js",
        fileRelativePath: "packages/feature/index.js",
      };
      expect(schema.expose).toBeDefined();
      expect(schema.expose!(args)).toBe("custom.packages.feature");
    });

    it("should expose package with custom array namespace", () => {
      const schema = createTECPackage(["custom", "namespace"]);
      const args: ExposeCallbackArguments = {
        entryPointName: "packages/feature",
        fileAbsolutePath: "/abs/path/packages/feature/index.js",
        fileName: "index.js",
        fileRelativePath: "packages/feature/index.js",
      };
      expect(schema.expose).toBeDefined();
      expect(schema.expose!(args)).toBe("custom.namespace.packages.feature");
    });
  });
});
