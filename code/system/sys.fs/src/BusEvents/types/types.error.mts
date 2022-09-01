type FilePath = string;

export type SysFsError = { code: SysFsErrorCode; message: string; path?: FilePath };

export type SysFsErrorCode =
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
