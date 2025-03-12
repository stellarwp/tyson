/**
 * Builds a string to be used as the external name of an entry point from its path.
 *
 * As an example this function would turn `/app/feature/turbo-name-v6.0.0-deluxe-edition`
 * to `app.feature.turboNameV600DeluxeEdition`.
 *
 * @param {string|string[]} namespace The namespace(s) the entry point should be prefixed with., e.g. `acme` or `['acme', 'plugin']`.
 * @param {string} relativePath The path the entry point should be prefixed with., e.g. `/app/feature/turbo-name`.
 * @param {string[]} dropFrags A list of path fragments to drop from the entry point name., e.g. `['app', 'js']`
 * to get rid of the `app` and `js` parts from the entry point relative path.
 *
 * @return {string} The external name of the entry point.
 */
export function buildExternalName(
  namespace: string | string[],
  relativePath: string,
  dropFrags: string[] = [],
): string {
  if (!namespace || (Array.isArray(namespace) && namespace.length === 0)) {
    throw new Error("Namespace cannot be empty");
  }

  if (!relativePath) {
    throw new Error("Name cannot be empty");
  }

  const namespaceString = Array.isArray(namespace)
    ? namespace.join(".")
    : namespace;

  return (
    namespaceString +
    "." +
    relativePath
      .split("/")
      .filter((f) => f)
      .filter((frag) => !dropFrags.includes(frag))
      .map((frag) =>
        frag.replace(/[\._-](\w)/g, (match) => match[1].toUpperCase()),
      )
      .join(".")
  );
}
