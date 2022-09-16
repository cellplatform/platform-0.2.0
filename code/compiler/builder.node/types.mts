import type { defineConfig, LibraryOptions, UserConfig, BuildOptions } from 'vite';

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

/**
 * Modify the vite config programatically from within the subject module.
 */
export type ModifyViteConfig = (args: ModifyViteConfigArgs) => Promise<unknown> | unknown;
export type ModifyViteConfigArgs = {
  readonly ctx: ModifyViteConfigCtx;
  addExternalDependency(moduleName: string | string[]): void;
  environment(target: 'web' | 'node'): void;
};
export type ModifyViteConfigCtx = {
  readonly name: string;
  readonly command: 'build' | 'serve';
  readonly mode: string;
  readonly pkg: PkgJson;
  readonly deps: { [key: string]: string }; // All dependencies (incl. "dev")
  readonly config: UserConfig;
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
