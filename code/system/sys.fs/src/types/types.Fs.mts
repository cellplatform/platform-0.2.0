import { t } from './common.mjs';

type DirPathString = string; //  Path to a directory, eg: "foo/"
type FilePathString = string; // Path to a file, eg: "foo/bar.txt"

/**
 * Information about a file.
 */
export type FsFileInfo = {
  kind: 'file' | 'dir' | 'unknown';
  path: FilePathString;
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
  dir(path: DirPathString): Fs;
};

type FsGetManifest = (options?: FsGetManifestOptions) => Promise<t.DirManifest>;
type FsGetManifestOptions = t.FsIndexerGetManifestOptions & {
  cache?: boolean | 'force' | 'remove';
  cachefile?: string; // Change from default "index.json"
};

type FsInfoMethod = (path: FilePathString) => Promise<FsFileInfo>;
type FsExistsMethod = (path: FilePathString) => Promise<boolean>;

type FsReadMethod = (path: FilePathString) => Promise<Uint8Array | undefined>;

type FsWriteMethod = (path: FilePathString, data: FsWriteMethodData) => Promise<FsWriteMethodResponse>;
type FsWriteMethodData = t.Json | Uint8Array | ReadableStream | undefined;
type FsWriteMethodResponse = { hash: string; bytes: number };

type FsCopyMethod = (source: FilePathString, target: FilePathString) => Promise<void>;
type FsMoveMethod = (source: FilePathString, target: FilePathString) => Promise<void>;
type FsDeleteMethod = (path: FilePathString) => Promise<void>;

type FsIs = {
  dir(path: FilePathString): Promise<boolean>;
  file(path: FilePathString): Promise<boolean>;
};

type FsJoin = (...segments: string[]) => string;

type FsJson = {
  read<T>(path: FilePathString): Promise<T> | undefined;
  write(path: FilePathString, data: t.Json): Promise<FsWriteMethodResponse>;
};
