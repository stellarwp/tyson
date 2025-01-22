import {
  addToDiscoveredPackageRoots,
  isPackageRootIndex,
  resetDiscoveredPackageRoots,
} from "../../src/functions/isPackageRootIndex";

describe("Package Root Index Detection", () => {
  beforeEach(() => {
    resetDiscoveredPackageRoots();
  });

  it("should identify root package index file when no other packages are discovered", () => {
    expect(isPackageRootIndex("src/index.js")).toBe(true);
  });

  it("should not identify sub-directory index file as root package index if parent is a package root", () => {
    addToDiscoveredPackageRoots("src");
    expect(isPackageRootIndex("src/subdir/index.js")).toBe(false);
  });

  it("should identify new root package index file when no previous roots intersect", () => {
    addToDiscoveredPackageRoots("src/packageA");
    expect(isPackageRootIndex("src/packageB/index.js")).toBe(true);
  });

  it("should not identify nested sub-directory index as root if any parent is a package root", () => {
    addToDiscoveredPackageRoots("src/packageA");
    expect(isPackageRootIndex("src/packageA/subdir1/subdir2/index.js")).toBe(
      false,
    );
  });

  it("should correctly handle multiple discovered package roots", () => {
    addToDiscoveredPackageRoots("src/packageA");
    addToDiscoveredPackageRoots("src/packageB");
    expect(isPackageRootIndex("src/packageC/index.js")).toBe(true);
  });
});
