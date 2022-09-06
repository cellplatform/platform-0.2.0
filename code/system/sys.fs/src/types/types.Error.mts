type FilePathString = string; // Path to a file, eg: "foo/bar.txt"

/**
 * Filesystem errors.
 */
export type FsErrorCode =
  | 'fs:client/timeout'
  | 'fs:info'
  | 'fs:read'
  | 'fs:read/404'
  | 'fs:write'
  | 'fs:delete'
  | 'fs:copy'
  | 'fs:move'
  | 'fs:manifest'
  | 'fs:unknown';

export type FsError = { code: FsErrorCode; message: string; path: FilePathString };
