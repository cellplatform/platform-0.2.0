import { type t } from './common';

type FilePath = string;
type FilesystemId = string;

/**
 * Compile the project into a bundle.
 */
export type FsBusInfoReqEvent = {
  type: 'sys.fs/info:req';
  payload: t.FsBusInfoReq;
};
export type FsBusInfoReq = { tx: string; id: FilesystemId; path?: FilePath | FilePath[] };

export type FsBusInfoResEvent = {
  type: 'sys.fs/info:res';
  payload: t.FsBusInfoRes;
};
export type FsBusInfoRes = {
  tx: string;
  id: FilesystemId;
  fs?: t.FsBusInfo;
  paths: t.FsBusPathInfo[];
  error?: t.FsError;
};
