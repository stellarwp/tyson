import { FileCallbackArguments } from "../../src/types/FileCallbackArguments";
import {
  entryPointName,
  expose,
  fileMatcher,
  TECPackage,
} from "../../src/schema/TECPackage";
import {
  addToDiscoveredPackageRoots,
  getDiscoveredPackageRoots,
} from "../../src/functions/isPackageRootIndex";
import { ExposeCallbackArguments } from "../../src/types/ExposeCallbackArguments";

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
    const match = fileMatcher(args);
    expect(match).toBe(true);
  });

  it("should return false for an index.js file in a subdirectory that is not a package root", () => {
    const args: FileCallbackArguments = {
      fileAbsolutePath: "/path/to/dir/subdir/index.js",
      fileName: "index.js",
      fileRelativePath: "dir/subdir/index.js",
    };
    addToDiscoveredPackageRoots("dir");
    expect(fileMatcher(args)).toBe(false);
  });

  it("should return false for a non-index file", () => {
    const args: FileCallbackArguments = {
      fileAbsolutePath: "/path/to/file.js",
      fileName: "file.js",
      fileRelativePath: "file.js",
    };
    expect(fileMatcher(args)).toBe(false);
  });

  it("should return false if the file is in a __tests__ directory", () => {
    const args: FileCallbackArguments = {
      fileAbsolutePath: "/path/to/__tests__/index.js",
      fileName: "index.js",
      fileRelativePath: "__tests__/index.js",
    };
    expect(fileMatcher(args)).toBe(false);
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
    expect(entryPointName(args)).toBe("subdir");
  });

  it("should add the directory to discovered package roots", () => {
    const args: FileCallbackArguments = {
      fileAbsolutePath: "/path/to/subdir/index.js",
      fileName: "index.js",
      fileRelativePath: "subdir/index.js",
    };
    entryPointName(args);
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

  it("should return the correct external name for a given entry point name", () => {
    const args: ExposeCallbackArguments = {
      entryPointName: "customizer-views-v2-live-preview",
      fileAbsolutePath:
        "/path/to/resources/packages/customizer-views-v2-live-preview/index.js",
      fileName: "index.js",
      fileRelativePath:
        "resources/packages/customizer-views-v2-live-preview/index.js",
    };
    expect(expose(args)).toBe("tec.customizerViewsV2LivePreview");
  });
});

describe("TECPackage", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should have the correct file extensions", () => {
    expect(TECPackage.fileExtensions).toEqual([".js", ".jsx", ".ts", ".tsx"]);
  });

  it("should use the correct fileMatcher function", () => {
    const args: FileCallbackArguments = {
      fileAbsolutePath: "/path/to/index.js",
      fileName: "index.js",
      fileRelativePath: "index.js",
    };
    expect(TECPackage.fileMatcher(args)).toBe(fileMatcher(args));
  });

  it("should use the correct entryPointName function", () => {
    const args: FileCallbackArguments = {
      fileAbsolutePath: "/path/to/subdir/index.js",
      fileName: "index.js",
      fileRelativePath: "subdir/index.js",
    };
    expect(TECPackage.entryPointName(args)).toBe(entryPointName(args));
  });

  it("should use the correct expose function", () => {
    const args: ExposeCallbackArguments = {
      entryPointName: "resources/packages/customizer-views-v2-live-preview",
      fileAbsolutePath:
        "/path/to/resources/packages/customizer-views-v2-live-preview/index.js",
      fileName: "index.js",
      fileRelativePath:
        "resources/packages/customizer-views-v2-live-preview/index.js",
    };
    // @ts-ignore
    expect(TECPackage.expose(args)).toBe(expose(args));
  });
});
