export type ModuleDef = {
  name: string;
  version: string;
  dependencies: { [key: string]: string };
  toString(): string;
};

export type ModuleImport<T> = Promise<T>;
export type ModuleImporter<T> = () => ModuleImport<T>;
export type ModuleImports<T> = { [namespace: string]: ModuleImporter<T> };
