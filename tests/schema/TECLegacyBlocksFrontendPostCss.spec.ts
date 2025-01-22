import { FileCallbackArguments } from "../../src/types/FileCallbackArguments";
import {
  entryPointName,
  fileMatcher,
  TECLegacyBlocksFrontendPostCss,
} from "../../src/schema/TECLegacyBlocksFrontendPostCss";

describe("fileMatcher", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("returns true if file name is 'frontend.pcss'", () => {
    const args: FileCallbackArguments = {
      fileName: "frontend.pcss",
      fileRelativePath: "frontend.pcss",
      fileAbsolutePath:
        "/users/bob/project/app/classic-event-details/frontend.pcss",
    };
    expect(fileMatcher(args)).toBe(true);
  });

  test("returns false if file name is not 'frontend.pcss'", () => {
    const args: FileCallbackArguments = {
      fileName: "otherfile.pcss",
      fileRelativePath: "otherfile.pcss",
      fileAbsolutePath:
        "/users/bob/project/app/classic-event-details/otherfile.pcss",
    };
    expect(fileMatcher(args)).toBe(false);
  });
});

describe("entryPointName", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("returns correct entry point name for given relative path", () => {
    const args: FileCallbackArguments = {
      fileName: "frontend.pcss",
      fileRelativePath: "app/classic-event-details/frontend.pcss",
      fileAbsolutePath:
        "/users/bob/project/app/classic-event-details/frontend.pcss",
    };
    expect(entryPointName(args)).toBe("app/classic-event-details/frontend");
  });
});

describe("TECLegacyBlocksFrontendPostCss", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("has correct fileExtensions", () => {
    expect(TECLegacyBlocksFrontendPostCss.fileExtensions).toEqual([".pcss"]);
  });

  test("uses the correct fileMatcher function", () => {
    const args: FileCallbackArguments = {
      fileName: "frontend.pcss",
      fileRelativePath: "app/classic-event-details/frontend.pcss",
      fileAbsolutePath:
        "/users/bob/project/app/classic-event-details/frontend.pcss",
    };
    expect(TECLegacyBlocksFrontendPostCss.fileMatcher!(args)).toBe(true);
  });

  test("uses the correct entryPointName function", () => {
    const args: FileCallbackArguments = {
      fileName: "frontend.pcss",
      fileRelativePath: "app/classic-event-details/frontend.pcss",
      fileAbsolutePath:
        "/users/bob/project/app/classic-event-details/frontend.pcss",
    };
    expect(TECLegacyBlocksFrontendPostCss.entryPointName!(args)).toBe(
      "app/classic-event-details/frontend",
    );
  });
});
