import { ExposedEntry } from "../types/ExposedEntry";

/**
 * Exposes a module to the global window object or a custom namespace.
 *
 * @param {string} exposeName - The name under which the module will be exposed. If it does not start with "window.",
 *     it will be prefixed with "__tyson_window.".
 * @param {string} path - The import path of the module to be exposed.
 *
 * @returns {ExposedEntry} An object representing the exposed entry, including its import path and library details.
 */
export function exposeEntry(exposeName: string, path: string): ExposedEntry {
  if (!exposeName.startsWith("window.")) {
    exposeName = `__tyson_window.${exposeName}`;
  }

  return {
    import: path,
    library: {
      name: exposeName,
      type: "window",
    },
  };
}
