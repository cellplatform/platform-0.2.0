/**
 * Error
 */
export declare type IError<T extends string = string> = {
    type: T;
    message: string;
    stack?: string;
    children?: IError[];
};
export declare type IErrorParent<T extends string = string> = {
    error?: IError<T>;
};
/**
 * FileSystem errors.
 */
export declare type FsError = 'FS/read' | 'FS/write' | 'FS/delete' | 'FS/copy';
export declare type IFsError<E extends FsError = FsError> = IError<E> & {
    path: string;
};
/**
 * File errors.
 */
export declare type FileError = 'FILE/upload' | 'FILE/copy';
export declare type IFileError<E extends FileError = FileError> = IError<E> & {
    filename: string;
};
export declare type IFileUploadError = IFileError<'FILE/upload'>;
