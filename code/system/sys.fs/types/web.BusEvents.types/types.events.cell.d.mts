import { t } from './common.mjs';
declare type FilesystemId = string;
declare type FilePath = string;
declare type CellAddress = string;
declare type FileHash = string;
declare type FileInfo = {
    path: FilePath;
    hash: FileHash;
    bytes: number;
};
export declare type SysFsPushedFile = FileInfo;
export declare type SysFsPulledFile = FileInfo;
/**
 * EVENTS
 */
export declare type SysFsCellEvent = SysFsCellPushReqEvent | SysFsCellPushResEvent | SysFsCellPullReqEvent | SysFsCellPullResEvent;
/**
 * Push files to a remote cell.
 */
export declare type SysFsCellPushReqEvent = {
    type: 'sys.fs/cell/push:req';
    payload: SysFsCellPushReq;
};
export declare type SysFsCellPushReq = {
    tx: string;
    id: FilesystemId;
    address: CellAddress;
    path?: FilePath | FilePath[];
};
export declare type SysFsCellPushResEvent = {
    type: 'sys.fs/cell/push:res';
    payload: SysFsCellPushRes;
};
export declare type SysFsCellPushRes = {
    ok: boolean;
    tx: string;
    id: FilesystemId;
    files: t.SysFsPushedFile[];
    errors: t.SysFsError[];
};
/**
 * Pull files to from a remote cell to the local filesystem.
 */
export declare type SysFsCellPullReqEvent = {
    type: 'sys.fs/cell/pull:req';
    payload: SysFsCellPullReq;
};
export declare type SysFsCellPullReq = {
    tx: string;
    id: FilesystemId;
    address: CellAddress;
    path?: FilePath | FilePath[];
};
export declare type SysFsCellPullResEvent = {
    type: 'sys.fs/cell/pull:res';
    payload: SysFsCellPullRes;
};
export declare type SysFsCellPullRes = {
    ok: boolean;
    tx: string;
    id: FilesystemId;
    files: t.SysFsPulledFile[];
    errors: t.SysFsError[];
};
export {};
