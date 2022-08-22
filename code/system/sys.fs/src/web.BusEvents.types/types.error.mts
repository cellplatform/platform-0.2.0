type FilePath = string;

export type SysFsError = { code: SysFsErrorCode; message: string; path?: FilePath };

export type SysFsErrorCode =
  | 'client/timeout'
  | 'info'
  | 'read'
  | 'read/404'
  | 'write'
  | 'delete'
  | 'copy'
  | 'move'
  | 'manifest'
  | 'cell/push'
  | 'cell/pull'
  | 'unknown';
