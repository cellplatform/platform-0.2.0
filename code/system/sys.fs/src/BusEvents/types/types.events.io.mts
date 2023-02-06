import type { t } from './common';

type FilePath = string;
type FilesystemId = string;

/**
 * EVENTS
 */
export type FsBusIoEvent =
  | FsBusReadReqEvent
  | FsBusReadResEvent
  | FsBusWriteReqEvent
  | FsBusWriteResEvent
  | FsBusDeleteReqEvent
  | FsBusDeleteResEvent
  | FsBusCopyReqEvent
  | FsBusCopyResEvent
  | FsBusMoveReqEvent
  | FsBusMoveResEvent;

/**
 * IO: Read
 */
export type FsBusReadReqEvent = {
  type: 'sys.fs/read:req';
  payload: FsBusReadReq;
};
export type FsBusReadReq = { tx: string; id: FilesystemId; path: FilePath | FilePath[] };

export type FsBusReadResEvent = {
  type: 'sys.fs/read:res';
  payload: FsBusReadRes;
};
export type FsBusReadRes = t.FsBusReadResponse & { tx: string; id: FilesystemId };

/**
 * IO: Write
 */
export type FsBusWriteReqEvent = {
  type: 'sys.fs/write:req';
  payload: FsBusWriteReq;
};
export type FsBusWriteReq = { tx: string; id: FilesystemId; file: t.FsBusFile | t.FsBusFile[] };

export type FsBusWriteResEvent = {
  type: 'sys.fs/write:res';
  payload: FsBusWriteRes;
};
export type FsBusWriteRes = t.FsBusWriteResponse & { tx: string; id: FilesystemId };

/**
 * IO: Delete
 */
export type FsBusDeleteReqEvent = {
  type: 'sys.fs/delete:req';
  payload: FsBusDeleteReq;
};
export type FsBusDeleteReq = { tx: string; id: FilesystemId; path: FilePath | FilePath[] };

export type FsBusDeleteResEvent = {
  type: 'sys.fs/delete:res';
  payload: FsBusDeleteRes;
};
export type FsBusDeleteRes = t.FsBusDeleteResponse & { tx: string; id: FilesystemId };

/**
 * IO: Copy
 */
export type FsBusCopyReqEvent = {
  type: 'sys.fs/copy:req';
  payload: FsBusCopyReq;
};
export type FsBusCopyReq = {
  tx: string;
  id: FilesystemId;
  file: t.FsBusFileTarget | t.FsBusFileTarget[];
};

export type FsBusCopyResEvent = {
  type: 'sys.fs/copy:res';
  payload: FsBusCopyRes;
};
export type FsBusCopyRes = t.FsBusCopyResponse & { tx: string; id: FilesystemId };

/**
 * IO: Move
 */
export type FsBusMoveReqEvent = {
  type: 'sys.fs/move:req';
  payload: FsBusMoveReq;
};
export type FsBusMoveReq = {
  tx: string;
  id: FilesystemId;
  file: t.FsBusFileTarget | t.FsBusFileTarget[];
};

export type FsBusMoveResEvent = {
  type: 'sys.fs/move:res';
  payload: FsBusMoveRes;
};
export type FsBusMoveRes = t.FsBusMoveResponse & { tx: string; id: FilesystemId };
