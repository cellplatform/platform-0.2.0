export type PathString = string;
export type DirString = PathString;
export type VersionString = string;

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
 * Configuration instructions for an ESM module,
 * that is translated into [nodejs] index entries
 * on the [package.json] file.
 */
export type EsmConfig = {
  exports: EsmConfigExports;
};

/**
 * Ref:
 * https://nodejs.org/api/packages.html#packages_exports
 */
export type EsmConfigExports = { [entry: string]: PathString };

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
 * Node [package.json] file.
 */
export type PackageJson = {
  name: string;
  version: string;
  type: 'module';
  types?: string;
  typesVersions?: PackageJsonTypesVersions;
  exports?: PackageJsonExports;
  dependencies?: { [name: string]: VersionString };
  devDependencies?: { [name: string]: VersionString };
};

/**
 * Ref:
 * https://nodejs.org/api/packages.html#packages_exports
 */
export type PackageJsonExports = { [entry: string]: PathString };

/**
 * Ref:
 * https://www.typescriptlang.org/docs/handbook/declaration-files/publishing.html#version-selection-with-typesversions
 */
export type PackageJsonTypesVersions = { [matchVersion: string]: PackageJsonTypesVersionsFiles };
export type PackageJsonTypesVersionsFiles = { [matchFile: string]: string[] };
