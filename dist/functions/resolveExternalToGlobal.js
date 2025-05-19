"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveExternalToGlobal = resolveExternalToGlobal;
/**
 * Resolves a package request to a global variable name.
 * This function shoudl be used in the WebPack configuration `externals` property.
 *
 *
 * @since TBD
 *
 * @param {string} packagePrefix The prefix to match against the request, e.g., '@tec/package'.
 * @param {string} packageWindowObjectName The name of the global object in the window, e.g., 'window.tec.package'.
 *
 * @return {Function} A function that handles request resolution.
 */
function resolveExternalToGlobal(packagePrefix, packageWindowObjectName) {
    /**
     * Handles the request resolution, checking if it starts with the package prefix.
     *
     * @since TBD
     *
     * @param {string} request The import path being requested.
     * @param {function} callback Callback function used to indicate how the module should be externalized.
     *
     * @return {void} The function does not return a value.
     */
    return function ({ request }, callback) {
        if (request.startsWith(packagePrefix)) {
            const path = request
                .replace(packagePrefix, "")
                .replace(/^\//g, "")
                .replace(/\//g, ".");
            return callback(null, packageWindowObjectName + (path ? "." + path : ""));
        }
        callback();
    };
}
