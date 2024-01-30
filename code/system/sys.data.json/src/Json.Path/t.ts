type Index = number;
export type JsonPath = (string | Index)[];

/**
 * A version of <JsonPath> that is strong typed to an object.
 */
export type TypedJsonPath<T> = T extends object
  ? { [K in keyof T]: [K, ...TypedJsonPath<T[K]>] | [K] }[keyof T]
  : [];
