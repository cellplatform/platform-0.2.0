import { t } from './common.mjs';
declare type FilesystemId = string;
declare type FilePath = string;
export declare type SysFsManifestDirResponse = {
    dir: FilePath;
    manifest: t.DirManifest;
    error?: t.SysFsError;
};
/**
 * EVENTS
 */
export declare type SysFsIndexEvent = SysFsManifestReqEvent | SysFsManifestResEvent;
/**
 * Manifest index of directory.
 */
export declare type SysFsManifestReqEvent = {
    type: 'sys.fs/manifest:req';
    payload: SysFsManifestReq;
};
export declare type SysFsManifestReq = {
    tx: string;
    id: FilesystemId;
    dir?: FilePath | FilePath[];
    cache?: boolean | 'force' | 'remove';
    cachefile?: string;
};
export declare type SysFsManifestResEvent = {
    type: 'sys.fs/manifest:res';
    payload: SysFsManifestRes;
};
export declare type SysFsManifestRes = {
    tx: string;
    id: FilesystemId;
    dirs: SysFsManifestDirResponse[];
    error?: t.SysFsError;
};
export {};
