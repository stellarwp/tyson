import { dirname } from "path";

/**
 * A list of package roots discovered so far.
 *
 * @type {string[]}
 */
let discoveredPackageRoots = [];

/**
 * Returns whether a file is a package index file or not.
 * Package index files are index files that are not found in sub-directories of previously discovered packages.
 * This function leverages the fact that the node `readdir` function will scan directories depth-first.
 *
 * @param {string} fileRelativePath The file path relative to the schema location.
 *
 * @returns {boolean} Whether the file is a package index file or not.
 */
export function isPackageRootIndex(fileRelativePath: string): boolean {
  const dirFrags = dirname(fileRelativePath)
    .split("/")
    .filter((frag) => frag !== "")
    .reverse();
  let curDir = dirFrags.pop();
  let prevDir = null;
  while (dirFrags.length !== 0 && prevDir !== curDir) {
    if (discoveredPackageRoots.includes(curDir)) {
      return false;
    }
    prevDir = curDir;
    curDir += "/" + dirFrags.pop();
  }

  return true;
}

/**
 * Reset the so far discovered package roots.
 */
export function resetDiscoveredPackageRoots(): void {
  discoveredPackageRoots = [];
}

/**
 * Add a discovered package root to the set of so far discovered package roots.
 *
 * @param {string} packageRoot The package root to add.
 */
export function addToDiscoveredPackageRoots(packageRoot: string): void {
  discoveredPackageRoots.push(packageRoot);
}

/**
 * Returns the package roots discovered so far.
 *
 * @return {string[]} The package roots discovered so far.
 */
export function getDiscoveredPackageRoots(): string[] {
  return discoveredPackageRoots;
}
