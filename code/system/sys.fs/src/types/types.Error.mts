type FilePath = string; // Path to a file, eg: "foo/bar.txt"

/**
 * Filesystem errors.
 */
export type FsErrorType = 'FS/read' | 'FS/write' | 'FS/delete' | 'FS/copy';
export type FsError = {
  type: FsErrorType;
  message: string;
  path: FilePath;
};
