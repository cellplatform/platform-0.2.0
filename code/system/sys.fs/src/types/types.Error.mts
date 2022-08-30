/**
 * Filesystem errors.
 */
export type FsErrorType = 'FS/read' | 'FS/write' | 'FS/delete' | 'FS/copy';
export type FsError = {
  type: FsErrorType;
  message: string;
  path: string;
  stack?: string;
};
