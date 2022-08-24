/**
 * Error
 */
export type IError<T extends string = string> = {
  type: T;
  message: string;
  stack?: string;
  children?: IError[];
};
export type IErrorParent<T extends string = string> = { error?: IError<T> };

/**
 * FileSystem errors.
 */
export type FsError = 'FS/read' | 'FS/write' | 'FS/delete' | 'FS/copy';
export type IFsError<E extends FsError = FsError> = IError<E> & { path: string };

/**
 * File errors.
 */
export type FileError = 'FILE/upload' | 'FILE/copy';
export type IFileError<E extends FileError = FileError> = IError<E> & { filename: string };
export type IFileUploadError = IFileError<'FILE/upload'>;

/**
 * TODO 🐷
 * - RENAME IFileError => [FileError]
 * - RENAME IFsError   => [FsError]
 * - RENAME IError (??)
 */
