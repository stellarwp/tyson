type UseEntry =
  | string
  | {
      loader?: string;
      options?: object;
    };

export type WebPackRule = {
  test?: RegExp;
  issuer?: RegExp;
  use?: UseEntry | UseEntry[];
  type:
    | "javascript/auto"
    | "javascript/dynamic"
    | "javascript/esm"
    | "json"
    | "webassembly/sync"
    | "webassembly/async"
    | "asset"
    | "asset/source"
    | "asset/resource"
    | "asset/inline"
    | "css/auto";
};
