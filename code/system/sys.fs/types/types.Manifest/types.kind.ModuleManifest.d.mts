import { t } from './common.mjs';
declare type Url = string;
declare type FilePath = string;
declare type Timestamp = number;
declare type Sha256 = string;
/**
 * Details about a compiled Module ("bundle of code").
 */
export declare type ModuleManifest = t.Manifest<ModuleManifestFile, ModuleManifestHash> & {
    kind: 'module';
    module: ModuleManifestInfo;
};
export declare type ModuleManifestHash = t.ManifestHash & {
    module: Sha256;
};
export declare type ModuleManifestFile = t.ManifestFile;
/**
 * Meta-data describing the bundled code [module].
 */
export declare type ModuleManifestInfo = {
    namespace: string;
    version: string;
    compiler: string;
    compiledAt: Timestamp;
    mode: string;
    target: string;
    entry: FilePath;
    remote?: ModuleManifestRemoteExports;
};
/**
 * Federated "module exports".
 */
export declare type ModuleManifestRemoteExports = {
    entry: FilePath;
    exports: ModuleManifestRemoteExport[];
};
export declare type ModuleManifestRemoteExport = {
    path: FilePath;
};
/**
 * A federated "module export" represented from the
 * consuming side (aka. an "import").
 */
export declare type ModuleManifestRemoteImport = {
    url: Url;
    namespace: string;
    entry: string;
};
export {};
