import { TECPostCss } from "../../src";
import {
  entryPointName,
  fileMatcher,
  modifyConfig,
} from "../../src/schema/TECPostCss";
import { WebPackConfiguration } from "../../src/types/WebPackConfiguration";

describe("fileMatcher", () => {
  beforeEach(() => jest.resetModules());
  afterEach(() => jest.clearAllMocks());

  it("returns true for files not starting with _", () => {
    const args = {
      fileName: "example.pcss",
      fileRelativePath: "",
      fileAbsolutePath: "",
    };
    expect(fileMatcher(args)).toBe(true);
  });

  it("returns false for files starting with _", () => {
    const args = {
      fileName: "_example.pcss",
      fileRelativePath: "",
      fileAbsolutePath: "",
    };
    expect(fileMatcher(args)).toBe(false);
  });
});

describe("entryPointName", () => {
  beforeEach(() => jest.resetModules());
  afterEach(() => jest.clearAllMocks());

  it("replaces .pcss with empty string and prefixes with css/", () => {
    const args = {
      fileName: "example.pcss",
      fileRelativePath: "path/to/example.pcss",
      fileAbsolutePath: "",
    };
    expect(entryPointName(args)).toBe("css/path/to/example");
  });

  it("does not replace if .pcss is not present", () => {
    const args = {
      fileName: "example.css",
      fileRelativePath: "path/to/example.css",
      fileAbsolutePath: "",
    };
    expect(entryPointName(args)).toBe("css/path/to/example.css");
  });
});

describe("modifyConfig", () => {
  beforeEach(() => jest.resetModules());
  afterEach(() => jest.clearAllMocks());

  it("adds a new rule to the WebPack configuration", () => {
    const config: WebPackConfiguration = { module: { rules: [] } };
    modifyConfig(config);
    expect(config.module.rules).toHaveLength(1);
    expect(config.module.rules[0].test.toString()).toBe(
      /src\/modules\/.*?\.pcss$/.toString(),
    );
  });

  it("does not override existing rules", () => {
    const config: WebPackConfiguration = {
      module: {
        rules: [
          { test: /\.js$/, use: "babel-loader", type: "javascript/auto" },
        ],
      },
    };
    modifyConfig(config);
    expect(config.module.rules).toHaveLength(2);
    expect(config.module.rules[0].test.toString()).toBe(/\.js$/.toString());
    expect(config.module.rules[1].test.toString()).toBe(
      /src\/modules\/.*?\.pcss$/.toString(),
    );
  });
});

describe("TECPostCss", () => {
  beforeEach(() => jest.resetModules());
  afterEach(() => jest.clearAllMocks());

  it("exports a ConfigurationSchema with correct properties", () => {
    expect(TECPostCss).toEqual({
      fileExtensions: [".pcss"],
      fileMatcher,
      entryPointName,
      modifyConfig,
    });
  });
});
