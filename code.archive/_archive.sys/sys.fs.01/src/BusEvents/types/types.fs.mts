import { type t } from './common';

type DirPath = string; //  Path to a directory, eg: "foo/"
type FilePath = string; // Path to a file, eg: "foo/bar.txt"
type FileHash = string;
type FilesystemId = string;

export type FsBusInfo = {
  id: FilesystemId;
  dir: DirPath; // The root directory of the filesystem scope.
};

export type FsBusPathInfo = {
  kind: 'file' | 'dir' | 'unknown';
  path: FilePath | DirPath;
  exists: boolean;
  hash: string;
  bytes: number;
  error?: t.FsError;
};

export type FsBusFile = { path: FilePath; data: Uint8Array; hash: FileHash };
export type FsBusFileTarget = { source: FilePath; target: FilePath };

export type FsBusFileReadResponse = {
  file?: FsBusFile;
  error?: t.FsError;
};
export type FsBusFileWriteResponse = {
  path: FilePath;
  hash: FileHash;
  error?: t.FsError;
};
export type FsBusFileCopyResponse = {
  source: FilePath;
  target: FilePath;
  hash: FileHash;
  error?: t.FsError;
};
export type FsBusFileMoveResponse = {
  source: FilePath;
  target: FilePath;
  hash: FileHash;
  error?: t.FsError;
};
export type FsBusFileDeleteResponse = {
  path: FilePath;
  hash: FileHash;
  existed: boolean;
  error?: t.FsError;
};

export type FsBusReadResponse = { files: FsBusFileReadResponse[]; error?: t.FsError };
export type FsBusWriteResponse = { files: FsBusFileWriteResponse[]; error?: t.FsError };
export type FsBusDeleteResponse = { files: FsBusFileDeleteResponse[]; error?: t.FsError };
export type FsBusCopyResponse = { files: FsBusFileCopyResponse[]; error?: t.FsError };
export type FsBusMoveResponse = { files: FsBusFileMoveResponse[]; error?: t.FsError };

export type FsBusToUint8Array = (input: FsBusToUint8ArrayInput) => Promise<Uint8Array>;
type FsBusToUint8ArrayInput = Uint8Array | ReadableStream | t.Json | undefined;
