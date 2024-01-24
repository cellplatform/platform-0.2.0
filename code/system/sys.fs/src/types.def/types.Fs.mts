import type { t } from '../common';

type DirPath = string; //  Path to a directory, eg: "foo/"
type FilePath = string; // Path to a file, eg: "foo/bar.txt"

/**
 * Information about a file.
 */
export type FsFileInfo = {
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
export type Fs = {
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

type FsGetManifest = (options?: FsGetManifestOptions) => Promise<t.DirManifest>;
type FsGetManifestOptions = t.FsIndexerGetManifestOptions & {
  cache?: boolean | 'force' | 'remove';
  cachefile?: string; // Change from default "index.json"
};

type FsInfoMethod = (path: FilePath) => Promise<FsFileInfo>;
type FsExistsMethod = (path: FilePath) => Promise<boolean>;

type FsReadMethod = (path: FilePath) => Promise<Uint8Array | undefined>;

type FsWriteMethod = (path: FilePath, data: FsWriteMethodData) => Promise<FsWriteMethodResponse>;
type FsWriteMethodData = t.Json | Uint8Array | ReadableStream | undefined;
type FsWriteMethodResponse = { hash: string; bytes: number };

type FsCopyMethod = (source: FilePath, target: FilePath) => Promise<void>;
type FsMoveMethod = (source: FilePath, target: FilePath) => Promise<void>;
type FsDeleteMethod = (path: FilePath) => Promise<void>;

type FsIs = {
  dir(path: FilePath): Promise<boolean>;
  file(path: FilePath): Promise<boolean>;
};

type FsJoin = (...segments: string[]) => string;

type FsJson = {
  read<T>(path: FilePath): Promise<T> | undefined;
  write(path: FilePath, data: t.Json): Promise<FsWriteMethodResponse>;
};
