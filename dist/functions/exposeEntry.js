"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exposeEntry = exposeEntry;
function exposeEntry(exposeName, path) {
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
