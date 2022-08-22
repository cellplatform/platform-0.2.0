import { t } from './common.mjs';
declare type Timestamp = number;
declare type Sha256 = string;
/**
 * Details about a compiled Module ("bundle of code").
 */
export declare type DirManifest = t.Manifest<DirManifestFile, DirManifestHash> & {
    kind: 'dir';
    dir: DirManifestInfo;
};
export declare type DirManifestHash = t.ManifestHash & {
    dir: Sha256;
};
export declare type DirManifestFile = t.ManifestFile;
export declare type DirManifestInfo = {
    indexedAt: Timestamp;
};
export {};
