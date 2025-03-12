# Function Documentation

## buildExternalName

The `buildExternalName` function is used to generate a standardized external name for entry points in your build system. It converts file paths and namespaces into a dot-notation format suitable for module naming.

### Syntax

```typescript
buildExternalName(namespace: string | string[], relativePath: string, dropFrags?: string[]): string
```

### Parameters

- `namespace`: A string or array of strings that defines the namespace(s) for the entry point
  - As string: `"acme"`
  - As array: `["acme", "plugin"]`
- `relativePath`: The file path to be converted into the entry point name
- `dropFrags`: (Optional) Array of path fragments to exclude from the final name

### Examples

#### Basic Usage with String Namespace

```typescript
buildExternalName("acme", "/app/feature/turbo-name")
// Returns: "acme.app.feature.turboName"
```

#### Using Array-based Namespace

```typescript
buildExternalName(["acme", "plugin"], "/app/feature/turbo-name")
// Returns: "acme.plugin.app.feature.turboName"
```

#### Dropping Path Fragments

```typescript
// With string namespace
buildExternalName("acme", "/app/feature/turbo-name", ["app"])
// Returns: "acme.feature.turboName"

// With array namespace
buildExternalName(["acme", "plugin"], "/app/feature/turbo-name", ["app"])
// Returns: "acme.plugin.feature.turboName"
```

#### Handling Special Characters

The function automatically handles special characters, converting them to camelCase:

```typescript
buildExternalName(
  ["acme", "plugin"],
  "/app/feature_turbo_name_v6.0.0-deluxe-edition"
)
// Returns: "acme.plugin.app.featureTurboNameV600DeluxeEdition"
```

### Error Handling

The function will throw errors in the following cases:

1. Empty namespace:
   ```typescript
   buildExternalName("", "/app/feature") // Error: "Namespace cannot be empty"
   buildExternalName([], "/app/feature") // Error: "Namespace cannot be empty"
   ```

2. Empty relative path:
   ```typescript
   buildExternalName("acme", "") // Error: "Name cannot be empty"
   ```

### Use Cases

This function is particularly useful when:

1. Setting up webpack entry points
2. Defining module names in a build system
3. Creating consistent naming patterns across a project
4. Managing multiple plugin namespaces in a single build

### Best Practices

1. Use array-based namespaces when you need to represent hierarchical plugin structures
2. Keep namespace segments short and meaningful
3. Use the `dropFrags` parameter to remove common prefixes or suffixes that don't add value to the final name
4. Maintain consistency in namespace naming across your project 