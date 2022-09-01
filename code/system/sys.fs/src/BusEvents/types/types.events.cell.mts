import { t } from './common.mjs';

type FilesystemId = string;
type FilePath = string;
type CellAddress = string; // <CellDomain>/<CellUri>
type FileHash = string;

type FileInfo = { path: FilePath; hash: FileHash; bytes: number };
export type SysFsPushedFile = FileInfo;
export type SysFsPulledFile = FileInfo;

/**
 * EVENTS
 */
export type SysFsCellEvent =
  | SysFsCellPushReqEvent
  | SysFsCellPushResEvent
  | SysFsCellPullReqEvent
  | SysFsCellPullResEvent;

/**
 * Push files to a remote cell.
 */
export type SysFsCellPushReqEvent = {
  type: 'sys.fs/cell/push:req';
  payload: SysFsCellPushReq;
};
export type SysFsCellPushReq = {
  tx: string;
  id: FilesystemId;
  address: CellAddress;
  path?: FilePath | FilePath[];
};

export type SysFsCellPushResEvent = {
  type: 'sys.fs/cell/push:res';
  payload: SysFsCellPushRes;
};
export type SysFsCellPushRes = {
  ok: boolean;
  tx: string;
  id: FilesystemId;
  files: t.SysFsPushedFile[];
  errors: t.FsError[];
};

/**
 * Pull files to from a remote cell to the local filesystem.
 */
export type SysFsCellPullReqEvent = {
  type: 'sys.fs/cell/pull:req';
  payload: SysFsCellPullReq;
};
export type SysFsCellPullReq = {
  tx: string;
  id: FilesystemId;
  address: CellAddress;
  path?: FilePath | FilePath[]; // "dir/" or "path/file.ext" or "path/*.ext" or "path/**/*" etc.
};

export type SysFsCellPullResEvent = {
  type: 'sys.fs/cell/pull:res';
  payload: SysFsCellPullRes;
};
export type SysFsCellPullRes = {
  ok: boolean;
  tx: string;
  id: FilesystemId;
  files: t.SysFsPulledFile[];
  errors: t.FsError[];
};
