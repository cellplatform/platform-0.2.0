import { t } from './common.mjs';
declare type FilePath = string;
declare type DirPath = string;
/**
 * Information about a file.
 */
export declare type FsFileInfo = {
    kind: 'file' | 'dir' | 'unknown';
    path: FilePath;
    exists: boolean;
    hash: string;
    bytes: number;
};
/**
 * High-level [FS] client API for programming
 * in a lean/simple/powerful/elegant way against
 * the lower-level "platform" specific [FsDriver].
 */
export declare type Fs = {
    is: FsIs;
    json: FsJson;
    manifest: FsGetManifest;
    info: FsInfoMethod;
    exists: FsExistsMethod;
    read: FsReadMethod;
    write: FsWriteMethod;
    copy: FsCopyMethod;
    move: FsMoveMethod;
    delete: FsDeleteMethod;
    join: FsJoin;
    dir(path: DirPath): Fs;
};
declare type FsGetManifest = (options?: FsGetManifestOptions) => Promise<t.DirManifest>;
declare type FsGetManifestOptions = t.FsIndexerGetManifestOptions & {
    cache?: boolean | 'force' | 'remove';
    cachefile?: string;
};
declare type FsInfoMethod = (path: FilePath) => Promise<FsFileInfo>;
declare type FsExistsMethod = (path: FilePath) => Promise<boolean>;
declare type FsReadMethod = (path: FilePath) => Promise<Uint8Array | undefined>;
declare type FsWriteMethod = (path: FilePath, data: FsWriteMethodData) => Promise<FsWriteMethodResponse>;
declare type FsWriteMethodData = t.Json | Uint8Array | ReadableStream;
declare type FsWriteMethodResponse = {
    hash: string;
    bytes: number;
};
declare type FsCopyMethod = (source: FilePath, target: FilePath) => Promise<void>;
declare type FsMoveMethod = (source: FilePath, target: FilePath) => Promise<void>;
declare type FsDeleteMethod = (path: FilePath) => Promise<void>;
declare type FsIs = {
    dir(path: FilePath): Promise<boolean>;
    file(path: FilePath): Promise<boolean>;
};
declare type FsJoin = (...segments: string[]) => string;
declare type FsJson = {
    read<T>(path: FilePath): Promise<T> | undefined;
    write(path: FilePath, data: t.Json): Promise<FsWriteMethodResponse>;
};
export {};
