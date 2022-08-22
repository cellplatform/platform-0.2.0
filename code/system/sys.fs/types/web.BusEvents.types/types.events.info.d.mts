import { t } from './common.mjs';
declare type FilesystemId = string;
declare type FilePath = string;
/**
 * Compile the project into a bundle.
 */
export declare type SysFsInfoReqEvent = {
    type: 'sys.fs/info:req';
    payload: t.SysFsInfoReq;
};
export declare type SysFsInfoReq = {
    tx: string;
    id: FilesystemId;
    path?: FilePath | FilePath[];
};
export declare type SysFsInfoResEvent = {
    type: 'sys.fs/info:res';
    payload: t.SysFsInfoRes;
};
export declare type SysFsInfoRes = {
    tx: string;
    id: FilesystemId;
    fs?: t.SysFsInfo;
    paths: t.SysFsPathInfo[];
    error?: t.SysFsError;
};
export {};
