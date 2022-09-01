import { FsError } from './types.Error.mjs';

type DirPath = string; //  Path to a directory, eg: "foo/"
type FilePath = string; // Path to a file, eg: "foo/bar.txt"
type PathUri = string; //  URI representing a file-path, eg: "path:foo/bar.png"
type FileUri = string; //  URI representing an absolute location of a file, eg: "file:///foo/bar.png"

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
  read: FsReadMethod<IFsRead>;
  write: FsWriteMethod<IFsWrite>;
  copy: FsCopyMethod<IFsCopy>;
  delete: FsDeleteMethod<IFsDelete>;
};

/**
 * ...implementation parts...
 */

export type FsPathResolver = (uri: PathUri) => FilePath;
export type FsInfoMethod<Info extends FsMeta> = (address: PathUri) => Promise<Info>;
export type FsReadMethod<Read extends IFsRead> = (address: PathUri) => Promise<Read>;

export type FsWriteOptions = { filename?: string };
export type FsWriteMethod<Write extends IFsWrite> = (
  address: PathUri,
  data: Uint8Array | ReadableStream,
  options?: FsWriteOptions,
) => Promise<Write>;

export type FsCopyMethod<Copy extends IFsCopy> = (
  source: PathUri,
  target: PathUri,
  // options?: CopyOptions,
) => Promise<Copy>;

export type FsDeleteMethod<Delete extends IFsDelete> = (
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
 * Local file-system (Extensions)
 */
export type FsInfo = FsMeta & {
  uri: PathUri;
  exists: boolean;
  kind: 'file' | 'dir' | 'unknown';
};
export type IFsRead = {
  uri: PathUri;
  ok: boolean; // TODO 🐷 remove OK - presence of error is enough.
  status: number; // TODO 🐷  remove status code
  error?: FsError;
  file?: FsFileData<FsMeta>;
};
export type IFsWrite = {
  uri: PathUri;
  ok: boolean;
  status: number;
  error?: FsError;
  file: FsFileData<FsMeta>;
};
export type IFsDelete = {
  ok: boolean;
  status: number;
  uris: PathUri[];
  locations: string[];
  error?: FsError;
};
export type IFsCopy = {
  ok: boolean;
  status: number;
  error?: FsError;
  source: PathUri;
  target: PathUri;
};
