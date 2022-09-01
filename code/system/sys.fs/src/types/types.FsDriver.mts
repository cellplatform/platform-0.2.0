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
  info: FsInfoMethod<FsInfo>;

  /**
   * Network IO (in/out).
   */
  read: FsReadMethod<FsRead>;
  write: FsWriteMethod<FsWrite>;
  copy: FsCopyMethod<FsCopy>;
  delete: FsDeleteMethod<FsDelete>;
};

/**
 * ...implementation parts...
 */

export type FsPathResolver = (uri: PathUri) => FilePath;
export type FsInfoMethod<Info extends FsMeta> = (address: PathUri) => Promise<Info>;
export type FsReadMethod<Read extends FsRead> = (address: PathUri) => Promise<Read>;

export type FsWriteOptions = { filename?: string };
export type FsWriteMethod<Write extends FsWrite> = (
  address: PathUri,
  data: Uint8Array | ReadableStream,
  options?: FsWriteOptions,
) => Promise<Write>;

export type FsCopyMethod<Copy extends FsCopy> = (source: PathUri, target: PathUri) => Promise<Copy>;

export type FsDeleteMethod<Delete extends FsDelete> = (
  address: PathUri | PathUri[],
) => Promise<Delete>;

/**
 * File (meta/info)
 */
export type FsMeta = {
  path: FilePath;
  location: FileUri;
  hash: string;
  bytes: number;
};

/**
 * File (info + data)
 */
export type FsFileData<I extends FsMeta = FsMeta> = I & { data: Uint8Array };

/**
 * Operations.
 */
export type FsInfo = FsMeta & {
  uri: PathUri;
  exists: boolean;
  kind: 'file' | 'dir' | 'unknown';
};
export type FsRead = {
  ok: boolean;
  status: HttpStatusCode;
  uri: PathUri;
  file?: FsFileData<FsMeta>;
  error?: FsError;
};
export type FsWrite = {
  ok: boolean;
  status: HttpStatusCode;
  uri: PathUri;
  file: FsFileData<FsMeta>;
  error?: FsError;
};
export type FsDelete = {
  ok: boolean;
  status: HttpStatusCode;
  uris: PathUri[];
  locations: string[];
  error?: FsError;
};
export type FsCopy = {
  ok: boolean;
  status: HttpStatusCode;
  source: PathUri;
  target: PathUri;
  error?: FsError;
};
