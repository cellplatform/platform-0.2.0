import type { UserConfig } from 'vite';

export type PathString = string;
export type DirString = PathString;
export type ImportMetaUrl = PathString; // eg: the ESM [import.meta.url] value.
export type VersionString = string;

export type PathFilter = (path: PathString) => boolean;

export type BuilderEnv = 'node' | 'web' | 'web:react' | 'web:svelte';

/**
 * [tsconfig.json] file.
 * https://www.typescriptlang.org/tsconfig
 */
export type TsConfig = {
  extends?: string;
  include?: string[];
  compilerOptions: TsConfigCompilerOptions;
};
export type TsConfigCompilerOptions = {
  rootDir?: string;
  lib: string[];
  jsx?: 'react-jsx';

  allowJs?: boolean;
  checkJs?: boolean;
  noEmit: boolean;
};

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
  lib(options?: { name?: string; entry?: string; outname?: string }): void;
  addExternalDependency(moduleName: string | string[]): void;
  env(...target: BuilderEnv[]): void;
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
 * Raw modification of [tsconfig.json] from within the subject module.
 */
export type TsConfigExport = (args: TsConfigExportArgs) => Promise<TsConfig>;
export type TsConfigExportArgs = { config: TsConfig; kind: ModifyTsConfigKind };

/**
 * A set of "conceptual" alterations to signal to a configurator helper
 * how to adjust a [tsconfig.json] file.
 */
export type ModifyTsConfigKind = 'code' | 'types';
export type ModifyTsConfig = (args: ModifyTsConfigArgs) => Promise<unknown> | unknown;
export type ModifyTsConfigArgs = {
  readonly kind: ModifyTsConfigKind;
  readonly current: TsConfig;
  edit(fn: (current: TsConfig) => void): void;
  env(...target: BuilderEnv[]): void;
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
