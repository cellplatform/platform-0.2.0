import { FsError } from './types.Error.mjs';

type DirPath = string; //  Path to a directory, eg: "foo/"
type FilePath = string; // Path to a file, eg: "foo/bar.txt"
type PathUri = string; //  URI representing a file-path, eg: "path:foo/bar.png"
type FileUri = string; //  URI representing an absolute location of a file, eg: "file:///foo/bar.png"
type HttpStatusCode = number;

/**
 * MAIN Driver (API)
 * The low-level bridge into a specific platform file-system API
 */
export type FsDriver = {
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

export type FsPathResolver = (uri: PathUri) => FilePath;
export type FsDriverInfoMethod<Info extends FsDriverMeta> = (address: PathUri) => Promise<Info>;
export type FsDriverReadMethod<Read extends FsDriverRead> = (address: PathUri) => Promise<Read>;

export type FsDriverWriteMethod<Write extends FsDriverWrite> = (
  address: PathUri,
  data: Uint8Array | ReadableStream,
  options?: { filename?: string },
) => Promise<Write>;

export type FsDriverCopyMethod<Copy extends FsDriverCopy> = (
  source: PathUri,
  target: PathUri,
) => Promise<Copy>;

export type FsDriverDeleteMethod<Delete extends FsDriverDelete> = (
  address: PathUri | PathUri[],
) => Promise<Delete>;

/**
 * File (meta/info)
 */
export type FsDriverMeta = {
  path: FilePath;
  location: FileUri;
  hash: string;
  bytes: number;
};

/**
 * File (info + data)
 */
export type FsDriverFileData<I extends FsDriverMeta = FsDriverMeta> = I & { data: Uint8Array };

/**
 * Operations.
 */
export type FsDriverInfo = FsDriverMeta & {
  uri: PathUri;
  exists: boolean;
  kind: 'file' | 'dir' | 'unknown';
};
export type FsDriverRead = {
  ok: boolean;
  status: HttpStatusCode;
  uri: PathUri;
  file?: FsDriverFileData<FsDriverMeta>;
  error?: FsError;
};
export type FsDriverWrite = {
  ok: boolean;
  status: HttpStatusCode;
  uri: PathUri;
  file: FsDriverFileData<FsDriverMeta>;
  error?: FsError;
};
export type FsDriverDelete = {
  ok: boolean;
  status: HttpStatusCode;
  uris: PathUri[];
  locations: FileUri[];
  error?: FsError;
};
export type FsDriverCopy = {
  ok: boolean;
  status: HttpStatusCode;
  source: PathUri;
  target: PathUri;
  error?: FsError;
};
