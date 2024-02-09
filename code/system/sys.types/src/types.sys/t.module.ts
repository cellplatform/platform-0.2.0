export type ModuleDef = {
  name: string;
  version: string;
  dependencies: { [key: string]: string };
  toString(): string;
};

export type ModuleImport<T = unknown> = Promise<T>;
export type ModuleImporter<T = unknown> = () => ModuleImport<T>;
export type ModuleImports<T = unknown> = { [name: string]: ModuleImporter<T> };
