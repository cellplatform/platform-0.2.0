import { IFsError } from './types.Error.mjs';
import { t } from './common.mjs';
declare type EmptyObject = Record<string, undefined>;
declare type FileUri = string;
declare type FilePath = string;
declare type FileAddress = FileUri | FilePath;
export declare type FsType = FsTypeLocal | FsTypeS3;
export declare type FsTypeLocal = 'LOCAL';
export declare type FsTypeS3 = 'S3';
export declare type FsS3Permission = 'private' | 'public-read';
/**
 * Driver (API)
 * The low-level bridge into a specific platform file-system API.
 */
export declare type FsDriver = FsDriverLocal;
/**
 * A "local" filesystem for instance a POSIX or IndexDB <BLOB> storage.
 */
export declare type FsDriverLocal = IFsMembers<FsTypeLocal, IFsInfoLocal, IFsReadLocal, IFsWriteLocal, IFsWriteOptionsLocal, IFsDeleteLocal, IFsCopyLocal, IFsCopyOptionsLocal, IFsResolveOptionsLocal>;
/**
 * Remote cloud <BLOB> storage that conforms to the AWS/S3 "pseudo-standard" API.
 */
export declare type IFsWriteOptions = IFsWriteOptionsLocal | IFsWriteOptionsS3;
export declare type IFsWriteOptionsLocal = {
    filename?: string;
};
export declare type IFsWriteOptionsS3 = {
    filename?: string;
    permission?: FsS3Permission;
};
export declare type IFsCopyOptions = IFsCopyOptionsLocal | IFsCopyOptionsS3;
export declare type IFsCopyOptionsLocal = EmptyObject;
export declare type IFsCopyOptionsS3 = {
    permission?: FsS3Permission;
};
/**
 * File-system Members
 */
declare type IFsMembers<Type extends FsType, Info extends IFsMeta, Read extends IFsRead, Write extends IFsWrite, WriteOptions extends IFsWriteOptions, Delete extends IFsDelete, Copy extends IFsCopy, CopyOptions extends IFsCopyOptions, ResolveOptions extends IFsResolveOptions> = {
    type: Type;
    /**
     * Meta-data.
     */
    dir: string;
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
export declare type FsPathResolver<O extends IFsResolveOptions> = (uri: string, options?: O) => IFsLocation;
export declare type FsInfoMethod<Info extends IFsMeta> = (address: FileAddress) => Promise<Info>;
export declare type FsReadMethod<Read extends IFsRead> = (address: FileAddress) => Promise<Read>;
export declare type FsWriteMethod<Write extends IFsWrite, WriteOptions extends IFsWriteOptions> = (address: FileAddress, data: Uint8Array | ReadableStream, options?: WriteOptions) => Promise<Write>;
export declare type FsCopyMethod<Copy extends IFsCopy, CopyOptions extends IFsCopyOptions> = (source: FileAddress, target: FileAddress, options?: CopyOptions) => Promise<Copy>;
export declare type FsDeleteMethod<Delete extends IFsDelete> = (address: FileAddress | FileAddress[]) => Promise<Delete>;
/**
 * File-system Location (Resolve)
 */
export declare type IFsLocation = {
    path: string;
    props: {
        [key: string]: string;
    };
};
export declare type IFsResolveOptions = IFsResolveOptionsLocal;
export declare type IFsResolveOptionsLocal = IFsResolveOptionsS3;
export declare type IFsResolveOptionsS3 = IFsResolveDefaultOptionsS3;
export declare type IFsResolveDefaultOptionsS3 = {
    type: 'DEFAULT';
};
/**
 * File (meta/info)
 */
declare type IFsMetaCommon = {
    path: string;
    location: string;
    hash: string;
    bytes: number;
};
export declare type IFsMeta = IFsMetaLocal | IFsMetaS3;
export declare type IFsMetaLocal = IFsMetaCommon;
export declare type IFsMetaS3 = IFsMetaCommon & {
    's3:etag'?: string;
    's3:permission'?: t.FsS3Permission;
};
/**
 * File (info + data)
 */
export declare type IFsFileData<I extends IFsMeta = IFsMeta> = I & {
    data: Uint8Array;
};
/**
 * Method Responses
 */
declare type IFsInfoCommon = {
    uri: string;
    exists: boolean;
};
declare type IFsReadCommon = {
    uri: string;
    ok: boolean;
    status: number;
    error?: IFsError;
};
declare type IFsWriteCommon = {
    uri: string;
    ok: boolean;
    status: number;
    error?: IFsError;
};
declare type IFsDeleteCommon = {
    ok: boolean;
    status: number;
    uris: string[];
    locations: string[];
    error?: IFsError;
};
declare type IFsCopyCommon = {
    ok: boolean;
    status: number;
    error?: IFsError;
    source: string;
    target: string;
};
export declare type IFsInfo = IFsInfoLocal;
export declare type IFsRead = IFsReadLocal;
export declare type IFsWrite = IFsWriteLocal;
export declare type IFsDelete = IFsDeleteLocal;
export declare type IFsCopy = IFsCopyLocal;
/**
 * Local file-system (Extensions)
 */
export declare type IFsInfoLocal = IFsInfoCommon & IFsMetaLocal & {
    kind: 'file' | 'dir' | 'unknown';
};
export declare type IFsReadLocal = IFsReadCommon & {
    file?: IFsFileData<IFsMetaLocal>;
};
export declare type IFsWriteLocal = IFsWriteCommon & {
    file: IFsFileData<IFsMetaLocal>;
};
export declare type IFsDeleteLocal = IFsDeleteCommon;
export declare type IFsCopyLocal = IFsCopyCommon;
export {};
/**
 * S3 (Extensions)
 */
