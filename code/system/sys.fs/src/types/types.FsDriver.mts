import { IFsError } from './types.Error.mjs';

type EmptyObject = Record<string, undefined>; // 🐷 NB: Used as a placeholder object.
type FileUri = string; // "file:..."
type FilePath = string; // "foo/bar.txt"
type FileAddress = FileUri | FilePath;

export type FsType = FsTypeLocal;
export type FsTypeLocal = 'LOCAL';

/**
 * Driver (API)
 * The low-level bridge into a specific platform file-system API.
 */
export type FsDriver = FsDriverLocal;

/**
 * A "local" filesystem for instance a POSIX or IndexDB <BLOB> storage.
 */
export type FsDriverLocal = IFsMembers<
  FsTypeLocal,
  IFsInfoLocal,
  IFsReadLocal,
  IFsWriteLocal,
  IFsWriteOptionsLocal,
  IFsDeleteLocal,
  IFsCopyLocal,
  IFsCopyOptionsLocal,
  IFsResolveOptionsLocal
>;

export type IFsWriteOptions = IFsWriteOptionsLocal;
export type IFsWriteOptionsLocal = { filename?: string };

export type IFsCopyOptions = IFsCopyOptionsLocal;
export type IFsCopyOptionsLocal = EmptyObject; // 🐷 No option parameters.

/**
 * File-system Members
 */
type IFsMembers<
  Type extends FsType,
  Info extends IFsMeta,
  Read extends IFsRead,
  Write extends IFsWrite,
  WriteOptions extends IFsWriteOptions,
  Delete extends IFsDelete,
  Copy extends IFsCopy,
  CopyOptions extends IFsCopyOptions,
  ResolveOptions extends IFsResolveOptions,
> = {
  type: Type;

  /**
   * Meta-data.
   */
  dir: string; // Root directory of the file-system.
  resolve: FsPathResolver<ResolveOptions>;
  info: FsInfoMethod<Info>;

  /**
   * Network IO (in/out).
   */
  read: FsReadMethod<Read>;
  write: FsWriteMethod<Write, WriteOptions>;
  copy: FsCopyMethod<Copy, CopyOptions>;
  delete: FsDeleteMethod<Delete>;
};

export type FsPathResolver<O extends IFsResolveOptions> = (uri: string, options?: O) => IFsLocation;
export type FsInfoMethod<Info extends IFsMeta> = (address: FileAddress) => Promise<Info>;
export type FsReadMethod<Read extends IFsRead> = (address: FileAddress) => Promise<Read>;
export type FsWriteMethod<Write extends IFsWrite, WriteOptions extends IFsWriteOptions> = (
  address: FileAddress,
  data: Uint8Array | ReadableStream,
  options?: WriteOptions,
) => Promise<Write>;
export type FsCopyMethod<Copy extends IFsCopy, CopyOptions extends IFsCopyOptions> = (
  source: FileAddress,
  target: FileAddress,
  options?: CopyOptions,
) => Promise<Copy>;
export type FsDeleteMethod<Delete extends IFsDelete> = (
  address: FileAddress | FileAddress[],
) => Promise<Delete>;

/**
 * File-system Location (Resolve)
 */
export type IFsLocation = {
  path: string;
  props: { [key: string]: string };
};

export type IFsResolveOptions = IFsResolveOptionsLocal;
export type IFsResolveOptionsLocal = { type: 'DEFAULT' };

/**
 * File (meta/info)
 */
type IFsMetaCommon = {
  path: string;
  location: string;
  hash: string;
  bytes: number;
};
export type IFsMeta = IFsMetaLocal;
export type IFsMetaLocal = IFsMetaCommon;

/**
 * File (info + data)
 */
export type IFsFileData<I extends IFsMeta = IFsMeta> = I & { data: Uint8Array };

/**
 * Method Responses
 */
type IFsInfoCommon = {
  uri: string;
  exists: boolean;
};

type IFsReadCommon = {
  uri: string;
  ok: boolean;
  status: number;
  error?: IFsError;
};

type IFsWriteCommon = {
  uri: string;
  ok: boolean;
  status: number;
  error?: IFsError;
};

type IFsDeleteCommon = {
  ok: boolean;
  status: number;
  uris: string[];
  locations: string[];
  error?: IFsError;
};

type IFsCopyCommon = {
  ok: boolean;
  status: number;
  error?: IFsError;
  source: string;
  target: string;
};

export type IFsInfo = IFsInfoLocal;
export type IFsRead = IFsReadLocal;
export type IFsWrite = IFsWriteLocal;
export type IFsDelete = IFsDeleteLocal;
export type IFsCopy = IFsCopyLocal;

/**
 * Local file-system (Extensions)
 */
export type IFsInfoLocal = IFsInfoCommon & IFsMetaLocal & { kind: 'file' | 'dir' | 'unknown' };
export type IFsReadLocal = IFsReadCommon & { file?: IFsFileData<IFsMetaLocal> };
export type IFsWriteLocal = IFsWriteCommon & { file: IFsFileData<IFsMetaLocal> };
export type IFsDeleteLocal = IFsDeleteCommon;
export type IFsCopyLocal = IFsCopyCommon;
