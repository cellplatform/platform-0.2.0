import { t } from './common.mjs';
export declare type IFileData = {
    props: IFileProps;
    hash?: string;
    error?: t.IError;
};
export declare type IFileProps = {
    mimetype?: string;
    location?: string;
    bytes?: number;
    integrity?: IFileIntegrity;
    allowRedirect?: boolean;
};
/**
 * File integrity (verification)
 */
export declare type FileIntegrityStatus = 'UPLOADING' | 'VALID' | 'INVALID' | 'INVALID/fileMissing' | 'INVALID/filehash' | 'INVALID/s3:etag';
export declare type IFileIntegrity = {
    status: FileIntegrityStatus;
    uploadedAt?: number;
    filehash?: string;
};
/**
 * Upload (presigned URL)
 */
export declare type IFilePresignedUploadUrl = {
    method: 'POST';
    expiresAt: number;
    filesystem: t.FsType;
    filename: string;
    uri: string;
    url: string;
    props: {
        [key: string]: string;
    };
};
