type FilePath = string; // Path to a file, eg: "foo/bar.txt"

/**
 * Filesystem errors.
 */
export type FsErrorCode = 'fs:read' | 'fs:write' | 'fs:delete' | 'fs:copy';
export type FsError = {
  code: FsErrorCode;
  message: string;
  path: FilePath;
};
