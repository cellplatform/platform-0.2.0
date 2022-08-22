import { t } from './common.mjs';
declare type FilesystemId = string;
declare type FilePath = string;
/**
 * EVENTS
 */
export declare type SysFsIoEvent = SysFsReadReqEvent | SysFsReadResEvent | SysFsWriteReqEvent | SysFsWriteResEvent | SysFsDeleteReqEvent | SysFsDeleteResEvent | SysFsCopyReqEvent | SysFsCopyResEvent | SysFsMoveReqEvent | SysFsMoveResEvent;
/**
 * IO: Read
 */
export declare type SysFsReadReqEvent = {
    type: 'sys.fs/read:req';
    payload: SysFsReadReq;
};
export declare type SysFsReadReq = {
    tx: string;
    id: FilesystemId;
    path: FilePath | FilePath[];
};
export declare type SysFsReadResEvent = {
    type: 'sys.fs/read:res';
    payload: SysFsReadRes;
};
export declare type SysFsReadRes = t.SysFsReadResponse & {
    tx: string;
    id: FilesystemId;
};
/**
 * IO: Write
 */
export declare type SysFsWriteReqEvent = {
    type: 'sys.fs/write:req';
    payload: SysFsWriteReq;
};
export declare type SysFsWriteReq = {
    tx: string;
    id: FilesystemId;
    file: t.SysFsFile | t.SysFsFile[];
};
export declare type SysFsWriteResEvent = {
    type: 'sys.fs/write:res';
    payload: SysFsWriteRes;
};
export declare type SysFsWriteRes = t.SysFsWriteResponse & {
    tx: string;
    id: FilesystemId;
};
/**
 * IO: Delete
 */
export declare type SysFsDeleteReqEvent = {
    type: 'sys.fs/delete:req';
    payload: SysFsDeleteReq;
};
export declare type SysFsDeleteReq = {
    tx: string;
    id: FilesystemId;
    path: FilePath | FilePath[];
};
export declare type SysFsDeleteResEvent = {
    type: 'sys.fs/delete:res';
    payload: SysFsDeleteRes;
};
export declare type SysFsDeleteRes = t.SysFsDeleteResponse & {
    tx: string;
    id: FilesystemId;
};
/**
 * IO: Copy
 */
export declare type SysFsCopyReqEvent = {
    type: 'sys.fs/copy:req';
    payload: SysFsCopyReq;
};
export declare type SysFsCopyReq = {
    tx: string;
    id: FilesystemId;
    file: t.SysFsFileTarget | t.SysFsFileTarget[];
};
export declare type SysFsCopyResEvent = {
    type: 'sys.fs/copy:res';
    payload: SysFsCopyRes;
};
export declare type SysFsCopyRes = t.SysFsCopyResponse & {
    tx: string;
    id: FilesystemId;
};
/**
 * IO: Move
 */
export declare type SysFsMoveReqEvent = {
    type: 'sys.fs/move:req';
    payload: SysFsMoveReq;
};
export declare type SysFsMoveReq = {
    tx: string;
    id: FilesystemId;
    file: t.SysFsFileTarget | t.SysFsFileTarget[];
};
export declare type SysFsMoveResEvent = {
    type: 'sys.fs/move:res';
    payload: SysFsMoveRes;
};
export declare type SysFsMoveRes = t.SysFsMoveResponse & {
    tx: string;
    id: FilesystemId;
};
export {};
