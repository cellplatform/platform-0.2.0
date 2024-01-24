import type { FsError } from './types.Error.mjs';

type DirPath = string; //  Path to a directory, eg: "foo/"
type FilePath = string; // Path to a file, eg: "foo/bar.txt"
type PathUriString = string; //  URI representing a file-path, eg: "path:foo/bar.png"
type FileUriString = string; //  URI representing an absolute location of a file, eg: "file:///foo/bar.png"
type HttpStatusCode = number;

/**
 * IO (Input/Output) driver.
 *    The low-level bridge into a specific platform file-system API or other form
 *    of path-addressable [Uint8Array] data-storage mechanism.
 */
export type FsIO = {
  /**
   * Path to the directory that represents the top-leve "scope" the driver
   * has permission to access within the underlying store.
   */
  dir: DirPath;

  /**
   * Meta-data.
   */
  resolve: FsPathResolver;
  info: FsDriverInfoMethod<FsDriverInfo>;

  /**
   * Network IO (in/out).
   */
  read: FsDriverReadMethod<FsDriverRead>;
  write: FsDriverWriteMethod<FsDriverWrite>;
  copy: FsDriverCopyMethod<FsDriverCopy>;
  delete: FsDriverDeleteMethod<FsDriverDelete>;
};

/**
 * ...implementation parts...
 */

export type FsPathResolver = (uri: PathUriString) => FilePath;
export type FsDriverInfoMethod<Info extends FsDriverMeta> = (
  address: PathUriString,
) => Promise<Info>;
export type FsDriverReadMethod<Read extends FsDriverRead> = (
  address: PathUriString,
) => Promise<Read>;

export type FsDriverWriteMethod<Write extends FsDriverWrite> = (
  address: PathUriString,
  payload: Uint8Array | ReadableStream,
) => Promise<Write>;

export type FsDriverCopyMethod<Copy extends FsDriverCopy> = (
  source: PathUriString,
  target: PathUriString,
) => Promise<Copy>;

export type FsDriverDeleteMethod<Delete extends FsDriverDelete> = (
  address: PathUriString | PathUriString[],
) => Promise<Delete>;

/**
 * File (meta/info)
 */
export type FsDriverMeta = {
  path: FilePath;
  location: FileUriString;
  hash: string;
  bytes: number;
};

/**
 * File (info + data)
 */
export type FsDriverFile<I extends FsDriverMeta = FsDriverMeta> = I & { data: Uint8Array };

/**
 * Operations.
 */
export type FsDriverInfo = FsDriverMeta & {
  uri: PathUriString;
  exists: boolean;
  kind: 'file' | 'dir' | 'unknown';
  error?: FsError;
};
export type FsDriverRead = {
  ok: boolean;
  status: HttpStatusCode;
  uri: PathUriString;
  file?: FsDriverFile<FsDriverMeta>;
  error?: FsError;
};
export type FsDriverWrite = {
  ok: boolean;
  status: HttpStatusCode;
  uri: PathUriString;
  file: FsDriverFile<FsDriverMeta>;
  error?: FsError;
};
export type FsDriverDelete = {
  ok: boolean;
  status: HttpStatusCode;
  uris: PathUriString[];
  locations: FileUriString[];
  error?: FsError;
};
export type FsDriverCopy = {
  ok: boolean;
  status: HttpStatusCode;
  source: PathUriString;
  target: PathUriString;
  error?: FsError;
};
