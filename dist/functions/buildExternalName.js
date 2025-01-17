"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildExternalName = buildExternalName;
/**
 * Builds a string to be used as the external name of an entry point from its path.
 *
 * As an example this function would turn `/app/feature/turbo-name-v6.0.0-deluxe-edition`
 * to `app.feature.turboNameV600DeluxeEdition`.
 *
 * @param {string} namespace The path the entry point should be prefixed with., e.g. `acme`.
 * @param {string} relativePath The path the entry point should be prefixed with., e.g. `/app/feature/turbo-name`.
 * @param {string[]} dropFrags A list of path fragments to drop from the entry point name., e.g. `['app', 'js']`
 * to get rid of the `app` and `js` parts from the entry point relative path.
 *
 * @return {string} The external name of the entry point.
 */
function buildExternalName(namespace, relativePath, dropFrags = []) {
    if (!namespace) {
        throw new Error("Namespace cannot be empty");
    }
    if (!relativePath) {
        throw new Error("Name cannot be empty");
    }
    return (namespace +
        "." +
        relativePath
            .split("/")
            .filter((frag) => !dropFrags.includes(frag))
            .map((frag) => frag.replace(/[\._-](\w)/g, (match) => match[1].toUpperCase()))
            .join("."));
}
