export type SpecImport = Promise<{ default: any }>;

export type Imports = {
  [namespace: string]: () => SpecImport;
};
