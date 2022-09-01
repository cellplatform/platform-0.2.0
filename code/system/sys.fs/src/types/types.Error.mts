type FilePath = string; // Path to a file, eg: "foo/bar.txt"

/**
 * Filesystem errors.
 */
export type FsErrorCode = 'FS/read' | 'FS/write' | 'FS/delete' | 'FS/copy';
export type FsError = {
  code: FsErrorCode;
  message: string;
  path: FilePath;
};
