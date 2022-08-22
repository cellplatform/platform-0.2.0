import { t } from './common.mjs';
declare type FilesystemId = string;
declare type FilePath = string;
declare type DirPath = string;
declare type FileHash = string;
export declare type SysFsInfo = {
    id: FilesystemId;
    dir: DirPath;
};
export declare type SysFsPathInfo = {
    kind: 'file' | 'dir' | 'unknown';
    path: FilePath | DirPath;
    exists: boolean;
    hash: string;
    bytes: number;
    error?: t.SysFsError;
};
export declare type SysFsFile = {
    path: FilePath;
    data: Uint8Array;
    hash: FileHash;
};
export declare type SysFsFileTarget = {
    source: FilePath;
    target: FilePath;
};
export declare type SysFsFileReadResponse = {
    file?: SysFsFile;
    error?: t.SysFsError;
};
export declare type SysFsFileWriteResponse = {
    path: FilePath;
    hash: FileHash;
    error?: t.SysFsError;
};
export declare type SysFsFileCopyResponse = {
    source: FilePath;
    target: FilePath;
    hash: FileHash;
    error?: t.SysFsError;
};
export declare type SysFsFileMoveResponse = {
    source: FilePath;
    target: FilePath;
    hash: FileHash;
    error?: t.SysFsError;
};
export declare type SysFsFileDeleteResponse = {
    path: FilePath;
    hash: FileHash;
    error?: t.SysFsError;
};
export declare type SysFsReadResponse = {
    files: SysFsFileReadResponse[];
    error?: t.SysFsError;
};
export declare type SysFsWriteResponse = {
    files: SysFsFileWriteResponse[];
    error?: t.SysFsError;
};
export declare type SysFsDeleteResponse = {
    files: SysFsFileDeleteResponse[];
    error?: t.SysFsError;
};
export declare type SysFsCopyResponse = {
    files: SysFsFileCopyResponse[];
    error?: t.SysFsError;
};
export declare type SysFsMoveResponse = {
    files: SysFsFileMoveResponse[];
    error?: t.SysFsError;
};
export declare type SysFsToUint8Array = (input: Uint8Array | ReadableStream | t.Json) => Promise<Uint8Array>;
export {};
