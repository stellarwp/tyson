import { cwd } from "process";
import { existsSync, readdirSync, statSync } from "fs";
import { basename, extname } from "path";
import { buildExternalName } from "./buildExternalName";
import { exposeEntry } from "./exposeEntry";
import { WebPackConfiguration } from "../types/WebPackConfiguration";
import { ConfigurationSchema } from "../types/ConfigurationSchema";
import { ExposedEntry } from "../types/ExposedEntry";

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
export function compileCustomEntryPoint(
  schema: ConfigurationSchema,
  relativePath: string,
  entries: { [k in string]: string | ExposedEntry },
  config: WebPackConfiguration,
): void {
  const fileExtensions = schema.fileExtensions;
  const fileMatcher = schema.fileMatcher;
  const locationAbsolutePath = cwd() + relativePath;

  if (!existsSync(locationAbsolutePath)) {
    return;
  }

  const files = readdirSync(locationAbsolutePath, { recursive: true });

  files.forEach((file) => {
    const fileAbsolutePath = locationAbsolutePath + "/" + file;

    // If the file is a directory, skip it.
    if (statSync(fileAbsolutePath).isDirectory()) {
      return;
    }

    const fileExtension = extname(file);

    // If the file extension is not among the ones we care about, skip it.
    if (!fileExtensions.includes(fileExtension)) {
      return;
    }

    const fileRelativePath = fileAbsolutePath.replace(locationAbsolutePath, "");
    const fileName = basename(fileAbsolutePath);
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
    } else {
      // If `schema.expose` is a string, then it's used as a namespace.
      const exposeName =
        typeof schema.expose === "string"
          ? buildExternalName(schema.expose, entryPointName)
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
      } else {
        // The callback did return a value, use it as expose name.
        entries[entryPointName] = exposeEntry(exposeName, fileAbsolutePath);
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
export function compileCustomEntryPoints(
  locations: { [k in string]: ConfigurationSchema },
  config: WebPackConfiguration,
) {
  const entries = {};

  Object.keys(locations).forEach((location) => {
    const schema = locations[location];
    compileCustomEntryPoint(schema, location, entries, config);
  });

  return entries;
}
