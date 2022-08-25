import { IFsError } from './types.Error.mjs';
import { t } from './common.mjs';

type EmptyObject = Record<string, undefined>; // 🐷 NB: Used as a placeholder object.
type FileUri = string; // "file:..."
type FilePath = string; // "foo/bar.txt"
type FileAddress = FileUri | FilePath;

export type FsType = FsTypeLocal | FsTypeS3;
export type FsTypeLocal = 'LOCAL';
export type FsTypeS3 = 'S3';

export type FsS3Permission = 'private' | 'public-read';

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

/**
 * Remote cloud <BLOB> storage that conforms to the AWS/S3 "pseudo-standard" API.
 */
// export type FsDriverS3 = IFsMembers<
//   FsTypeS3,
//   IFsInfoS3,
//   IFsReadS3,
//   IFsWriteS3,
//   IFsWriteOptionsS3,
//   IFsDeleteS3,
//   IFsCopyS3,
//   IFsCopyOptionsS3,
//   IFsResolveOptionsS3
// > & {
//   bucket: string;
//   endpoint: t.S3Endpoint;
// };

export type IFsWriteOptions = IFsWriteOptionsLocal | IFsWriteOptionsS3;
export type IFsWriteOptionsLocal = { filename?: string };
export type IFsWriteOptionsS3 = { filename?: string; permission?: FsS3Permission };

export type IFsCopyOptions = IFsCopyOptionsLocal | IFsCopyOptionsS3;
export type IFsCopyOptionsLocal = EmptyObject; // 🐷 No option parameters.
export type IFsCopyOptionsS3 = { permission?: FsS3Permission };

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

export type IFsResolveOptionsLocal = IFsResolveOptionsS3; // NB: the local file-system can simulate an S3 post.

export type IFsResolveOptionsS3 = IFsResolveDefaultOptionsS3;
//   | IFsResolveSignedGetOptionsS3
//   | IFsResolveSignedPutOptionsS3
//   | IFsResolveSignedPostOptionsS3;

export type IFsResolveDefaultOptionsS3 = { type: 'DEFAULT' };
// export type IFsResolveSignedGetOptionsS3 = t.S3SignedUrlGetObjectOptions & {
//   type: 'SIGNED/get';
//   endpoint?: t.S3EndpointKind;
// };
// export type IFsResolveSignedPutOptionsS3 = t.S3SignedUrlPutObjectOptions & { type: 'SIGNED/put' };
// export type IFsResolveSignedPostOptionsS3 = t.S3SignedPostOptions & { type: 'SIGNED/post' };

/**
 * File (meta/info)
 */
type IFsMetaCommon = {
  path: string;
  location: string;
  hash: string;
  bytes: number;
};
export type IFsMeta = IFsMetaLocal | IFsMetaS3;
export type IFsMetaLocal = IFsMetaCommon;
export type IFsMetaS3 = IFsMetaCommon & { 's3:etag'?: string; 's3:permission'?: t.FsS3Permission };

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

/**
 * S3 (Extensions)
 */
// export type IFsInfoS3 = IFsInfoCommon & IFsMetaS3;
// export type IFsReadS3 = IFsReadCommon & {
//   file?: IFsFileData<IFsMetaS3>;
//   's3:etag'?: string;
//   's3:permission'?: t.FsS3Permission;
// };
// export type IFsWriteS3 = IFsWriteCommon & {
//   file: IFsFileData<IFsMetaS3>;
//   's3:etag'?: string;
//   's3:permission'?: t.FsS3Permission;
// };
// export type IFsDeleteS3 = IFsDeleteCommon;
// export type IFsCopyS3 = IFsCopyCommon;
