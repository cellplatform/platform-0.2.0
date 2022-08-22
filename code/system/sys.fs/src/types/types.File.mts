import { t } from './common.mjs';

export type IFileData = {
  props: IFileProps;
  hash?: string;
  error?: t.IError;
};
export type IFileProps = {
  mimetype?: string;
  location?: string;
  bytes?: number;
  integrity?: IFileIntegrity;
  allowRedirect?: boolean; // Default true.  If false any attempt to (307) redirect upon serving the file will be supressed.
};

/**
 * File integrity (verification)
 */
export type FileIntegrityStatus =
  | 'UPLOADING'
  | 'VALID'
  | 'INVALID'
  | 'INVALID/fileMissing' // TODO 🐷 implement on integrity object.
  | 'INVALID/filehash'
  | 'INVALID/s3:etag';

export type IFileIntegrity = {
  status: FileIntegrityStatus;
  uploadedAt?: number;
  filehash?: string;
};

/**
 * Upload (presigned URL)
 */
export type IFilePresignedUploadUrl = {
  method: 'POST';
  expiresAt: number;
  filesystem: t.FsType;
  filename: string;
  uri: string;
  url: string;
  props: { [key: string]: string };
};
