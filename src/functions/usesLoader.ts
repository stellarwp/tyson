import { UseEntry } from "../types/WebPackRule";

/**
 * Returns whether a WebPack rule `use` entry uses the given loader.
 *
 * @param {UseEntry|UseEntry[]} ruleUse The webpack rule `use` property
 * @param {string} loader The loader to search for.
 *
 * @return {boolean} Whether or not the webpack rule `use` property uses the given loader.
 */
export function usesLoader(
  ruleUse: UseEntry | UseEntry[],
  loader: string,
): boolean {
  // The rule.use property is a string.
  if (typeof ruleUse === "string") {
    return ruleUse.includes(loader);
  }

  if (!Array.isArray(ruleUse)) {
    // If it's not an array, we cannot continue searching for our loader, so we can return false here.
    return false;
  }

  for (let i = 0; i < ruleUse.length; i++) {
    const use = ruleUse[i];

    if (typeof use === "string") {
      if (use.includes(loader)) {
        return true;
      }

      continue;
    }

    if (typeof use === "object") {
      if ((use?.loader || "").includes(loader)) {
        return true;
      }
    }
  }

  return false;
}
