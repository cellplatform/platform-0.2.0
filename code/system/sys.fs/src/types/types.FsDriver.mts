import { FsError } from './types.Error.mjs';

type EmptyObject = Record<string, undefined>; // 🐷 NB: Used as a placeholder object.
type DirPath = string;
type FilePath = string; // Path to a file, eg: "foo/bar.txt"
type PathUri = string; //  URI representing a file-path, eg: "path:foo/bar.png"
type FileUri = string; //  URI representing an absolute location of a file, eg: "file:///foo/bar.png"

/**
 * Driver (API)
 * The low-level bridge into a specific platform file-system API
 */
export type FsDriver = { dir: DirPath } & IFsMembers;

export type IFsWriteOptions = { filename?: string };
export type IFsCopyOptions = IFsCopyOptionsLocal;
export type IFsCopyOptionsLocal = EmptyObject; // 🐷 No option parameters.

/**
 * File-system Members
 */
type IFsMembers = {
  /**
   * Meta-data.
   */
  resolve: FsPathResolver;
  info: FsInfoMethod<IFsInfo>;

  /**
   * Network IO (in/out).
   */
  read: FsReadMethod<IFsRead>;
  write: FsWriteMethod<IFsWrite, IFsWriteOptions>;
  copy: FsCopyMethod<IFsCopy, IFsCopyOptions>;
  delete: FsDeleteMethod<IFsDelete>;
};

export type FsPathResolver = (uri: PathUri) => FilePath;
export type FsInfoMethod<Info extends IFsMeta> = (address: FilePath) => Promise<Info>;
export type FsReadMethod<Read extends IFsRead> = (address: FilePath) => Promise<Read>;
export type FsWriteMethod<Write extends IFsWrite, WriteOptions extends IFsWriteOptions> = (
  address: FilePath,
  data: Uint8Array | ReadableStream,
  options?: WriteOptions,
) => Promise<Write>;
export type FsCopyMethod<Copy extends IFsCopy, CopyOptions extends IFsCopyOptions> = (
  source: FilePath,
  target: FilePath,
  options?: CopyOptions,
) => Promise<Copy>;
export type FsDeleteMethod<Delete extends IFsDelete> = (
  address: FilePath | FilePath[],
) => Promise<Delete>;

/**
 * File (meta/info)
 */
export type IFsMeta = {
  path: FilePath;
  location: FileUri;
  hash: string;
  bytes: number;
};

/**
 * File (info + data)
 */
export type IFsFileData<I extends IFsMeta = IFsMeta> = I & { data: Uint8Array };

/**
 * Local file-system (Extensions)
 */
export type IFsInfo = IFsMeta & {
  uri: PathUri;
  exists: boolean;
  kind: 'file' | 'dir' | 'unknown';
};
export type IFsRead = {
  uri: PathUri;
  ok: boolean; // TODO 🐷 remove OK - presence of error is enough.
  status: number; // TODO 🐷  remove status code
  error?: FsError;
  file?: IFsFileData<IFsMeta>;
};
export type IFsWrite = {
  uri: PathUri;
  ok: boolean;
  status: number;
  error?: FsError;
  file: IFsFileData<IFsMeta>;
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
