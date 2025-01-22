import { exposeEntry } from "../../src";

describe("exposeEntry", () => {
  it("should prefix exposeName with __tyson_window. if it does not start with window.", () => {
    const result = exposeEntry("myModule", "path/to/module");
    expect(result.library.name).toBe("__tyson_window.myModule");
  });

  it("should not modify exposeName if it starts with window.", () => {
    const result = exposeEntry("window.myModule", "path/to/module");
    expect(result.library.name).toBe("window.myModule");
  });

  it("should return the correct import path", () => {
    const result = exposeEntry("myModule", "path/to/module");
    expect(result.import).toBe("path/to/module");
  });

  it("should set the library type to window", () => {
    const result = exposeEntry("myModule", "path/to/module");
    expect(result.library.type).toBe("window");
  });
});
