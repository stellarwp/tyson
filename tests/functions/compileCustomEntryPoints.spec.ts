import { ConfigurationSchema } from "../../src/types/ConfigurationSchema";
import { ExposedEntry } from "../../src/types/ExposedEntry";
import { WebPackConfiguration } from "../../src/types/WebPackConfiguration";
import {
  compileCustomEntryPoint,
  compileCustomEntryPoints,
} from "../../src/functions/compileCustomEntryPoints";
import { buildExternalName } from "../../src/functions/buildExternalName";

describe("compileCustomEntryPoint", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });
  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  test("should update entries with file absolute path when expose is false", () => {
    const schema: ConfigurationSchema = {
      fileExtensions: [".js"],
      entryPointName: () => "moduleOne",
      expose: () => false,
      fileMatcher: () => true,
    };
    const relativePath = "/tests/_data/moduleOne";
    const entries: { [k in string]: string | ExposedEntry } = {};
    const config: WebPackConfiguration = { module: { rules: [] } };

    compileCustomEntryPoint(schema, relativePath, entries, config);

    expect(entries).toEqual({
      moduleOne: `${process.cwd()}/tests/_data/moduleOne/index.js`,
    });
  });

  test("should update entries with ExposedEntry when expose is a string", () => {
    const schema: ConfigurationSchema = {
      fileExtensions: [".js"],
      entryPointName: () => "moduleOne",
      expose: ({ entryPointName }) =>
        buildExternalName("acme.product", entryPointName),
      fileMatcher: () => true,
    };
    const relativePath = "/tests/_data/moduleOne";
    const entries: { [k in string]: string | ExposedEntry } = {};
    const config: WebPackConfiguration = { module: { rules: [] } };

    compileCustomEntryPoint(schema, relativePath, entries, config);

    expect(entries).toHaveProperty("moduleOne");
    expect(entries["moduleOne"] as ExposedEntry).toEqual({
      import: `${process.cwd()}/tests/_data/moduleOne/index.js`,
      library: {
        name: "__tyson_window.acme.product.moduleOne",
        type: "window",
      },
    });
  });

  test("should not update entries when fileMatcher returns false", () => {
    const schema: ConfigurationSchema = {
      fileExtensions: [".js"],
      entryPointName: () => "moduleOne",
      expose: () => false,
      fileMatcher: () => false,
    };
    const relativePath = "/tests/_data/moduleOne";
    const entries: { [k in string]: string | ExposedEntry } = {};
    const config: WebPackConfiguration = { module: { rules: [] } };

    compileCustomEntryPoint(schema, relativePath, entries, config);

    expect(entries).toEqual({});
  });

  test("should call modifyConfig when provided", () => {
    const schema: ConfigurationSchema = {
      fileExtensions: [".js"],
      entryPointName: () => "moduleOne",
      expose: () => false,
      fileMatcher: () => true,
      modifyConfig: jest.fn(),
    };
    const relativePath = "/tests/_data/moduleOne";
    const entries: { [k in string]: string | ExposedEntry } = {};
    const config: WebPackConfiguration = { module: { rules: [] } };

    compileCustomEntryPoint(schema, relativePath, entries, config);

    expect(schema.modifyConfig).toHaveBeenCalled();
  });
});

describe("compileCustomEntryPoints", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });
  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  test("should compile multiple entry points", () => {
    const schema1: ConfigurationSchema = {
      fileExtensions: [".js"],
      entryPointName: ({ fileName }) => fileName,
      expose: () => false,
      fileMatcher: () => true,
    };
    const schema2: ConfigurationSchema = {
      fileExtensions: [".ts"],
      entryPointName: () => "moduleTwo",
      expose: ({ entryPointName }) => buildExternalName("acme", entryPointName),
      fileMatcher: () => true,
    };
    const schema3: ConfigurationSchema = {
      fileExtensions: [".pcss"],
      entryPointName: () => "moduleThree",
      expose: () => false,
      fileMatcher: () => true,
    };
    const locations = {
      "/tests/_data/moduleOne": schema1,
      "/tests/_data/moduleTwo": schema2,
      "/tests/_data/moduleThree": schema3,
    };
    const config: WebPackConfiguration = { module: { rules: [] } };

    const entries = compileCustomEntryPoints(locations, config);

    expect(entries).toEqual({
      "index.js": `${process.cwd()}/tests/_data/moduleOne/index.js`,
      moduleThree: `${process.cwd()}/tests/_data/moduleThree/style.pcss`,
      moduleTwo: {
        import: `${process.cwd()}/tests/_data/moduleTwo/index.ts`,
        library: {
          name: "__tyson_window.acme.moduleTwo",
          type: "window",
        },
      },
    });
  });
});
