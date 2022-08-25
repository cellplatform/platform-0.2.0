import { t } from './common.mjs';

type FilesystemId = string;
type FilePath = string;
type DirPath = string;
type FileHash = string;

export type SysFsInfo = {
  id: FilesystemId;
  dir: DirPath; // The root directory of the filesystem scope.
};

export type SysFsPathInfo = {
  kind: 'file' | 'dir' | 'unknown';
  path: FilePath | DirPath;
  exists: boolean;
  hash: string;
  bytes: number;
  error?: t.SysFsError;
};

export type SysFsFile = { path: FilePath; data: Uint8Array; hash: FileHash };
export type SysFsFileTarget = { source: FilePath; target: FilePath };

export type SysFsFileReadResponse = {
  file?: SysFsFile;
  error?: t.SysFsError;
};
export type SysFsFileWriteResponse = {
  path: FilePath;
  hash: FileHash;
  error?: t.SysFsError;
};
export type SysFsFileCopyResponse = {
  source: FilePath;
  target: FilePath;
  hash: FileHash;
  error?: t.SysFsError;
};
export type SysFsFileMoveResponse = {
  source: FilePath;
  target: FilePath;
  hash: FileHash;
  error?: t.SysFsError;
};
export type SysFsFileDeleteResponse = {
  path: FilePath;
  hash: FileHash;
  error?: t.SysFsError;
};

export type SysFsReadResponse = { files: SysFsFileReadResponse[]; error?: t.SysFsError };
export type SysFsWriteResponse = { files: SysFsFileWriteResponse[]; error?: t.SysFsError };
export type SysFsDeleteResponse = { files: SysFsFileDeleteResponse[]; error?: t.SysFsError };
export type SysFsCopyResponse = { files: SysFsFileCopyResponse[]; error?: t.SysFsError };
export type SysFsMoveResponse = { files: SysFsFileMoveResponse[]; error?: t.SysFsError };

export type SysFsToUint8Array = (
  input: Uint8Array | ReadableStream | t.Json,
) => Promise<Uint8Array>;
