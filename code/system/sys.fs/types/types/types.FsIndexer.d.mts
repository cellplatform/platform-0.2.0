import { t } from './common.mjs';
declare type DirPath = string;
export declare type FsPathFilter = (e: FsPathFilterArgs) => boolean;
export declare type FsPathFilterArgs = {
    path: string;
    is: {
        dir: boolean;
        file: boolean;
    };
};
/**
 * Index of a file-system.
 */
export declare type FsIndexer = {
    dir: string;
    manifest: FsIndexerGetManifest;
};
/**
 * Generate a directory listing manifest.
 */
export declare type FsIndexerGetManifest = (options?: FsIndexerGetManifestOptions) => Promise<t.DirManifest>;
export declare type FsIndexerGetManifestOptions = {
    dir?: DirPath;
    filter?: FsPathFilter;
};
export {};
