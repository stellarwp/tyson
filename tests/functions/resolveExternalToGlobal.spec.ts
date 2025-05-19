import { resolveExternalToGlobal } from "../../src/functions/resolveExternalToGlobal";

describe("resolveExternalToGlobal", () => {
  it("should resolve request to global name when matches prefix", () => {
    const packagePrefix = "@tec/package";
    const packageWindowObjectName = "window.tec.package";
    const resolveFn = resolveExternalToGlobal(
      packagePrefix,
      packageWindowObjectName,
    );

    const callback = jest.fn();
    resolveFn({ request: "@tec/package/src/index" }, callback);

    expect(callback).toHaveBeenCalledWith(null, "window.tec.package.src.index");
  });

  it("should not resolve if request does not match prefix", () => {
    const packagePrefix = "@tec/package";
    const packageWindowObjectName = "window.tec.package";
    const resolveFn = resolveExternalToGlobal(
      packagePrefix,
      packageWindowObjectName,
    );

    const callback = jest.fn();
    resolveFn({ request: "other/package" }, callback);

    expect(callback).toHaveBeenCalledWith();
  });

  it("should handle request exactly matching the package prefix", () => {
    const packagePrefix = "@tec/package";
    const packageWindowObjectName = "window.tec.package";
    const resolveFn = resolveExternalToGlobal(
      packagePrefix,
      packageWindowObjectName,
    );

    const callback = jest.fn();
    resolveFn({ request: "@tec/package" }, callback);

    expect(callback).toHaveBeenCalledWith(null, "window.tec.package");
  });

  it("should handle request with multiple slashes", () => {
    const packagePrefix = "@tec/package";
    const packageWindowObjectName = "window.tec.package";
    const resolveFn = resolveExternalToGlobal(
      packagePrefix,
      packageWindowObjectName,
    );

    const callback = jest.fn();
    resolveFn({ request: "@tec/package/abc/def" }, callback);

    expect(callback).toHaveBeenCalledWith(null, "window.tec.package.abc.def");
  });

  it("should handle empty request", () => {
    const packagePrefix = "@tec/package";
    const packageWindowObjectName = "window.tec.package";
    const resolveFn = resolveExternalToGlobal(
      packagePrefix,
      packageWindowObjectName,
    );

    const callback = jest.fn();
    resolveFn({ request: "" }, callback);

    expect(callback).toHaveBeenCalledWith();
  });
});
