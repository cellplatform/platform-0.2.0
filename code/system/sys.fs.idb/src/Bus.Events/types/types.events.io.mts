import { t } from './common.mjs';

type FilesystemId = string;
type FilePath = string;

/**
 * EVENTS
 */
export type SysFsIoEvent =
  | SysFsReadReqEvent
  | SysFsReadResEvent
  | SysFsWriteReqEvent
  | SysFsWriteResEvent
  | SysFsDeleteReqEvent
  | SysFsDeleteResEvent
  | SysFsCopyReqEvent
  | SysFsCopyResEvent
  | SysFsMoveReqEvent
  | SysFsMoveResEvent;

/**
 * IO: Read
 */
export type SysFsReadReqEvent = {
  type: 'sys.fs/read:req';
  payload: SysFsReadReq;
};
export type SysFsReadReq = { tx: string; id: FilesystemId; path: FilePath | FilePath[] };

export type SysFsReadResEvent = {
  type: 'sys.fs/read:res';
  payload: SysFsReadRes;
};
export type SysFsReadRes = t.SysFsReadResponse & { tx: string; id: FilesystemId };

/**
 * IO: Write
 */
export type SysFsWriteReqEvent = {
  type: 'sys.fs/write:req';
  payload: SysFsWriteReq;
};
export type SysFsWriteReq = { tx: string; id: FilesystemId; file: t.SysFsFile | t.SysFsFile[] };

export type SysFsWriteResEvent = {
  type: 'sys.fs/write:res';
  payload: SysFsWriteRes;
};
export type SysFsWriteRes = t.SysFsWriteResponse & { tx: string; id: FilesystemId };

/**
 * IO: Delete
 */
export type SysFsDeleteReqEvent = {
  type: 'sys.fs/delete:req';
  payload: SysFsDeleteReq;
};
export type SysFsDeleteReq = { tx: string; id: FilesystemId; path: FilePath | FilePath[] };

export type SysFsDeleteResEvent = {
  type: 'sys.fs/delete:res';
  payload: SysFsDeleteRes;
};
export type SysFsDeleteRes = t.SysFsDeleteResponse & { tx: string; id: FilesystemId };

/**
 * IO: Copy
 */
export type SysFsCopyReqEvent = {
  type: 'sys.fs/copy:req';
  payload: SysFsCopyReq;
};
export type SysFsCopyReq = {
  tx: string;
  id: FilesystemId;
  file: t.SysFsFileTarget | t.SysFsFileTarget[];
};

export type SysFsCopyResEvent = {
  type: 'sys.fs/copy:res';
  payload: SysFsCopyRes;
};
export type SysFsCopyRes = t.SysFsCopyResponse & { tx: string; id: FilesystemId };

/**
 * IO: Move
 */
export type SysFsMoveReqEvent = {
  type: 'sys.fs/move:req';
  payload: SysFsMoveReq;
};
export type SysFsMoveReq = {
  tx: string;
  id: FilesystemId;
  file: t.SysFsFileTarget | t.SysFsFileTarget[];
};

export type SysFsMoveResEvent = {
  type: 'sys.fs/move:res';
  payload: SysFsMoveRes;
};
export type SysFsMoveRes = t.SysFsMoveResponse & { tx: string; id: FilesystemId };
