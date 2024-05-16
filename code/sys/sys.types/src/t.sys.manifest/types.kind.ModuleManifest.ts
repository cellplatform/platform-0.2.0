import type { t } from '../common';

type Url = string;
type FilePath = string;
type Timestamp = number; // An Integer representing a date in milliseconds since the UNIX epoch.
type Sha256 = string;

/**
 * Details about a compiled Module ("bundle of code").
 */
export type ModuleManifest = t.Manifest<ModuleManifestFile, ModuleManifestHash> & {
  kind: 'module';
  module: ModuleManifestInfo;
};

export type ModuleManifestHash = t.ManifestHash & {
  module: Sha256; // Hash of files and meta-data: sha256({ module, files })
};

export type ModuleManifestFile = t.ManifestFile;

/**
 * Meta-data describing the bundled code [module].
 */
export type ModuleManifestInfo = {
  namespace: string;
  version: string; //   semver ("0.0.0" if not specified)
  compiler: string; //  "<name>@<version>"
  compiledAt: Timestamp;
  target: string; //    "web" | "node"
  entry: FilePath;
  remote?: ModuleManifestRemoteExports;
};

/**
 * Federated "module exports".
 */
export type ModuleManifestRemoteExports = {
  entry: FilePath; // Typically "remoteEntry.js"
  exports: ModuleManifestRemoteExport[];
};
export type ModuleManifestRemoteExport = { path: FilePath };

/**
 * A federated "module export" represented from the
 * consuming side (aka. an "import").
 */
export type ModuleManifestRemoteImport = {
  url: Url;
  namespace: string;
  entry: string;
};
