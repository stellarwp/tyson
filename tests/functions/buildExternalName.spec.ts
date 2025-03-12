import { buildExternalName } from "../../src";

describe("buildExternalName", () => {
  it("should throw an error if namespace is empty", () => {
    expect(() => buildExternalName("", "/app/feature/turbo-name")).toThrow(
      "Namespace cannot be empty",
    );
    expect(() => buildExternalName([], "/app/feature/turbo-name")).toThrow(
      "Namespace cannot be empty",
    );
  });

  it("should throw an error if relativePath is empty", () => {
    expect(() => buildExternalName("acme", "")).toThrow("Name cannot be empty");
    expect(() => buildExternalName(["acme", "plugin"], "")).toThrow(
      "Name cannot be empty",
    );
  });

  it("should correctly build external name without dropping any fragments", () => {
    expect(buildExternalName("acme", "/app/feature/turbo-name")).toBe(
      "acme.app.feature.turboName",
    );
  });

  it("should correctly build external name with array-based namespace", () => {
    expect(
      buildExternalName(["acme", "plugin"], "/app/feature/turbo-name"),
    ).toBe("acme.plugin.app.feature.turboName");
  });

  it("should correctly build external name and drop specified fragments", () => {
    expect(buildExternalName("acme", "/app/feature/turbo-name", ["app"])).toBe(
      "acme.feature.turboName",
    );
    expect(
      buildExternalName(["acme", "plugin"], "/app/feature/turbo-name", ["app"]),
    ).toBe("acme.plugin.feature.turboName");
  });

  it("should handle multiple underscores and hyphens in the path", () => {
    expect(
      buildExternalName(
        "acme",
        "/app/feature_turbo_name_v6.0.0-deluxe-edition",
        ["app"],
      ),
    ).toBe("acme.featureTurboNameV600DeluxeEdition");
    expect(
      buildExternalName(
        ["acme", "plugin"],
        "/app/feature_turbo_name_v6.0.0-deluxe-edition",
        ["app"],
      ),
    ).toBe("acme.plugin.featureTurboNameV600DeluxeEdition");
  });

  it("should correctly build external name with numbers and special characters", () => {
    expect(
      buildExternalName(
        "acme",
        "/app/feature_turbo_name_v6.0.0-deluxe-edition",
      ),
    ).toBe("acme.app.featureTurboNameV600DeluxeEdition");
    expect(
      buildExternalName(
        ["acme", "plugin"],
        "/app/feature_turbo_name_v6.0.0-deluxe-edition",
      ),
    ).toBe("acme.plugin.app.featureTurboNameV600DeluxeEdition");
  });
});
