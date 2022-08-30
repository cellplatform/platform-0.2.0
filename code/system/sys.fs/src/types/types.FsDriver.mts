import { IFsError } from './types.Error.mjs';

type EmptyObject = Record<string, undefined>; // 🐷 NB: Used as a placeholder object.
type FileAddress = string; // "foo/bar.txt"

/**
 * Driver (API)
 * The low-level bridge into a specific platform file-system API
 */
export type FsDriver = IFsMembers<
  IFsInfo,
  IFsRead,
  IFsWrite,
  IFsWriteOptions,
  IFsDelete,
  IFsCopy,
  IFsCopyOptionsLocal
>;

export type IFsWriteOptions = { filename?: string };
export type IFsCopyOptions = IFsCopyOptionsLocal;
export type IFsCopyOptionsLocal = EmptyObject; // 🐷 No option parameters.

/**
 * File-system Members
 */
type IFsMembers<
  Info extends IFsMeta,
  Read extends IFsRead,
  Write extends IFsWrite,
  WriteOptions extends IFsWriteOptions,
  Delete extends IFsDelete,
  Copy extends IFsCopy,
  CopyOptions extends IFsCopyOptions,
> = {
  /**
   * Meta-data.
   */
  resolve: FsPathResolver;
  info: FsInfoMethod<Info>;

  /**
   * Network IO (in/out).
   */
  read: FsReadMethod<Read>;
  write: FsWriteMethod<Write, WriteOptions>;
  copy: FsCopyMethod<Copy, CopyOptions>;
  delete: FsDeleteMethod<Delete>;
};

export type FsPathResolver = (uri: string) => IFsLocation;
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
export type IFsLocation = { path: string };

/**
 * File (meta/info)
 */
// type IFsMetaCommon = {
//   path: string;
//   location: string;
//   hash: string;
//   bytes: number;
// };
export type IFsMeta = {
  path: string;
  location: string;
  hash: string;
  bytes: number;
};

/**
 * File (info + data)
 */
export type IFsFileData<I extends IFsMeta = IFsMeta> = I & { data: Uint8Array };

/**
 * Method Responses
 */
// type IFsInfoCommon = {
//   uri: string;
//   exists: boolean;
// };

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

// export type IFsInfo = IFsInfoLocal;
// export type IFsRead = IFsReadLocal;
// export type IFsWrite = IFsWriteLocal;
// export type IFsDelete = IFsDeleteLocal;
// export type IFsCopy = IFsCopyLocal;

/**
 * Local file-system (Extensions)
 */
export type IFsInfo = IFsMeta & {
  uri: string;
  exists: boolean;
  kind: 'file' | 'dir' | 'unknown';
};
export type IFsRead = {
  uri: string;
  ok: boolean;
  status: number;
  error?: IFsError;
  file?: IFsFileData<IFsMeta>;
};
export type IFsWrite = IFsWriteCommon & { file: IFsFileData<IFsMeta> };
export type IFsDelete = IFsDeleteCommon;
export type IFsCopy = IFsCopyCommon;
