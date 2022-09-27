import type { UserConfig } from 'vite';

export type PathString = string;
export type DirString = PathString;
export type VersionString = string;

export type PathFilter = (path: PathString) => boolean;

/**
 * [tsconfig.json] file.
 * https://www.typescriptlang.org/tsconfig
 */
export type TsConfig = {
  extends?: string;
  include?: string[];
  compilerOptions: TsConfigCompilerOptions;
};
export type TsConfigCompilerOptions = { rootDir?: string };

/**
 * Vite [manifest.json] file.
 * https://vitejs.dev/config/build-options.html#build-manifest
 */
export type ViteManifest = { [filepath: PathString]: ViteManifestFile };
export type ViteManifestFile = {
  file: PathString;
  src: PathString;
  dynamicImports?: PathString[];
  isDynamicEntry?: boolean;
  isEntry?: boolean;
};

export type BuilderEnv = 'node' | 'web' | 'web:react';

/**
 * Modify the vite config programatically from within the subject module.
 */
export type ModifyViteConfig = (args: ModifyViteConfigArgs) => Promise<unknown> | unknown;
export type ModifyViteConfigArgs = {
  readonly ctx: ModifyViteConfigCtx;
  lib(options?: { name?: string; entry?: string; outname?: string }): void;
  addExternalDependency(moduleName: string | string[]): void;
  environment(target: BuilderEnv | BuilderEnv[]): void;
};
export type ModifyViteConfigCtx = {
  readonly name: PkgJson['name'];
  readonly command: 'build' | 'serve';
  readonly mode: string; // eg: "production"
  readonly pkg: PkgJson;
  readonly deps: PkgDep[];
  readonly config: UserConfig;
};

/**
 * Modify the builder [tsconfig.json] from within the subject module.
 */
export type ModifyTsconfig = (args: ModifyTsconfigArgs) => Promise<unknown> | unknown;
export type ModifyTsconfigArgs = {
  readonly ctx: ModifyTsconfigCtx;
  environment(target: BuilderEnv | BuilderEnv[]): void;
};
export type ModifyTsconfigCtx = {
  readonly name: PkgJson['name'];
};

/**
 * Node [package.json] file.
 */
export type PkgJson = {
  name: string;
  version: string;
  type: 'module';
  types?: string;
  typesVersions?: PkgJsonTypesVersions;
  exports?: PkgJsonExports;
  dependencies?: PkgDeps;
  devDependencies?: PkgDeps;
  workspaces?: { packages: string[] }; // Yarn workspaces.
};

export type PkgDeps = { [name: string]: VersionString };
export type PkgDep = { name: string; version: VersionString; isDev: boolean };

/**
 * Ref:
 * https://nodejs.org/api/packages.html#packages_exports
 */
export type PkgJsonExports = { [entry: string]: PathString };

/**
 * Ref:
 * https://www.typescriptlang.org/docs/handbook/declaration-files/publishing.html#version-selection-with-typesversions
 */
export type PkgJsonTypesVersions = { [matchVersion: string]: PkgJsonTypesVersionsFiles };
export type PkgJsonTypesVersionsFiles = { [matchFile: string]: string[] };
