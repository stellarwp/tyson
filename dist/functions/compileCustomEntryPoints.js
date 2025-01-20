"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileCustomEntryPoint = compileCustomEntryPoint;
exports.compileCustomEntryPoints = compileCustomEntryPoints;
const process_1 = require("process");
const fs_1 = require("fs");
const path_1 = require("path");
const buildExternalName_1 = require("./buildExternalName");
const exposeEntry_1 = require("./exposeEntry");
/**
 * Compiles a custom entry point, a WebPack configuration entry, from a location
 * and a schema.
 *
 * @param {ConfigurationSchema} schema The schema to use to compile the entry point.
 * @param {string} relativePath The relative path to use for the entry point.
 * @param {Object} entries The running list of entries to update in place.
 * @param {WebPackConfiguration} config The WebPack configuration to use for this entry point; updated in place if
 *     needed.
 *
 * @returns {void} Entries and or the WebPack configuration will be updated in place depending on the schema.
 */
function compileCustomEntryPoint(schema, relativePath, entries, config) {
    const fileExtensions = schema.fileExtensions;
    const fileMatcher = schema.fileMatcher;
    const locationAbsolutePath = (0, process_1.cwd)() + relativePath;
    if (!(0, fs_1.existsSync)(locationAbsolutePath)) {
        return;
    }
    const files = (0, fs_1.readdirSync)(locationAbsolutePath, { recursive: true });
    files.forEach((file) => {
        const fileAbsolutePath = locationAbsolutePath + "/" + file;
        // If the file is a directory, skip it.
        if ((0, fs_1.statSync)(fileAbsolutePath).isDirectory()) {
            return;
        }
        const fileExtension = (0, path_1.extname)(file);
        // If the file extension is not among the ones we care about, skip it.
        if (!fileExtensions.includes(fileExtension)) {
            return;
        }
        const fileRelativePath = fileAbsolutePath.replace(locationAbsolutePath, "");
        const fileName = (0, path_1.basename)(fileAbsolutePath);
        if (!fileMatcher({ fileName, fileRelativePath, fileAbsolutePath })) {
            return;
        }
        const entryPointName = schema.entryPointName({
            fileName,
            fileRelativePath,
            fileAbsolutePath,
        });
        if ((schema?.expose || false) === false || !file.match(/(t|j)sx?$/)) {
            // `schema.expose` is not set or set to `false`: do not expose.
            entries[entryPointName] = fileAbsolutePath;
        }
        else {
            // If `schema.expose` is a string, then it's used as a namespace.
            const exposeName = typeof schema.expose === "string"
                ? (0, buildExternalName_1.buildExternalName)(schema.expose, entryPointName)
                : // Else build the name using `schema.expose` as a callback.
                    schema.expose({
                        entryPointName,
                        fileName,
                        fileRelativePath,
                        fileAbsolutePath,
                    });
            if (!exposeName) {
                // The callback did not return a value, do not expose.
                entries[entryPointName] = fileAbsolutePath;
            }
            else {
                // The callback did return a value, use it as expose name.
                entries[entryPointName] = (0, exposeEntry_1.exposeEntry)(exposeName, fileAbsolutePath);
            }
        }
        if (schema.modifyConfig) {
            // Modify the current WebPack configuration by reference.
            schema.modifyConfig(config);
        }
    });
}
/**
 * Compile all custom entry points.
 *
 * @param {Object<string,ConfigurationSchema>} locations A map from relative paths to the configuration schemas that
 *     should be used to compile them.
 * @param {WebPackConfiguration} config The WebPack configuration that will be updated in place.
 */
function compileCustomEntryPoints(locations, config) {
    const entries = {};
    Object.keys(locations).forEach((location) => {
        const schema = locations[location];
        compileCustomEntryPoint(schema, location, entries, config);
    });
    return entries;
}
