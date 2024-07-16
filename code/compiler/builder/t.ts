import type { UserConfig as ViteUserConfig } from 'vite';
import type { OutgoingHttpHeaders } from 'node:http';

export { ViteUserConfig };

export type SortModulesBy = 'Topological' | 'Alpha' | 'None';
export type PathString = string;
export type DirString = PathString;
export type ImportMetaUrl = PathString; // eg: the ESM [import.meta.url] value.
export type VersionString = string;

export type PathFilter = (path: PathString) => boolean;

export type TsEnv = 'web' | 'web:react' | 'web:svelte';

export type ViteTarget = 'web' | 'node';
export type VitePlugin = 'web:react' | 'web:svelte' | 'rollup:visualizer' | 'ssl';

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

export type ViteLibEntry = { index: PathString; [name: string]: PathString };

/**
 * Modify the vite config programatically from within the subject module.
 */
export type ModifyViteConfig = (args: ModifyViteConfigArgs) => Promise<unknown> | unknown;
export type ModifyViteConfigArgs = {
  readonly ctx: ModifyViteConfigCtx;
  target(...target: ViteTarget[]): ModifyViteConfigArgs;
  plugin(...kind: VitePlugin[]): ModifyViteConfigArgs;
  externalDependency(moduleName: string | string[]): ModifyViteConfigArgs;
  chunk(alias: string, moduleName?: string | string[]): ModifyViteConfigArgs;
  lib(options?: { entry?: string | ViteLibEntry }): ModifyViteConfigArgs;
  headers(obj: OutgoingHttpHeaders): ModifyViteConfigArgs;
};
export type ModifyViteConfigCtx = {
  readonly name: PkgJson['name'];
  readonly command: 'build' | 'serve';
  readonly mode: string; // eg: "production"
  readonly pkg: PkgJson;
  readonly deps: PkgDep[];
  readonly config: ViteUserConfig;
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
  env(...target: TsEnv[]): void;
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
  scripts?: PkgJsonScripts;
  dependencies?: PkgDeps;
  devDependencies?: PkgDeps;
  workspaces?: { packages: string[] }; // Yarn workspaces.
};

export type PkgDeps = { [name: string]: VersionString };
export type PkgDep = { name: string; version: VersionString; isDev: boolean };

export type PkgJsonScripts = { [name: string]: string };

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

/**
 * Vitest test result object
 */
export type TestStats = {
  success: boolean;
  suites: { total: number; passed: number; failed: number; pending: number };
  tests: { total: number; passed: number; failed: number; pending: number; todo: number };
  error?: string;
};

export type VitestResultsData = {
  numTotalTestSuites: number;
  numPassedTestSuites: number;
  numFailedTestSuites: number;
  numPendingTestSuites: number;
  numTotalTests: number;
  numPassedTests: number;
  numFailedTests: number;
  numPendingTests: number;
  numTodoTests: number;
  startTime: number;
  success: boolean;
  testResults: Array<{
    assertionResults: {
      ancestorTitles: string[];
      fullName: string;
      title: string;
      status: 'passed' | 'failed';
      failureMessages: string[];
      location: { line: number; column: number };
      duration: number;
    }[];
    startTime: number;
    endTime: number;
    status: 'passed' | 'failed';
    message: string;
    name: string;
  }>;
};
