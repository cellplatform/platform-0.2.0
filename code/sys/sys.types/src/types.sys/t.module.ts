/**
 * NOTE: Generated for each module on build.
 */
export type ModuleDef = {
  name: string;
  version: string;
  dependencies: { [key: string]: string };
  toString(): string;
};

export type ModuleImport<T = unknown> = Promise<T>;
export type ModuleImporter<T = unknown> = () => ModuleImport<T>;
export type ModuleImports<T = unknown> = { [typename: string]: ModuleImporter<T> };
