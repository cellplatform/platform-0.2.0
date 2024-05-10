import { type t } from './common';

type FilePath = string;
type FilesystemId = string;

export type FsBusManifestDirResponse = {
  dir: FilePath;
  manifest: t.DirManifest;
  error?: t.FsError;
};

/**
 * EVENTS
 */
export type FsBusIndexEvent = FsBusManifestReqEvent | FsBusManifestResEvent;

/**
 * Manifest index of directory.
 */
export type FsBusManifestReqEvent = {
  type: 'sys.fs/manifest:req';
  payload: FsBusManifestReq;
};
export type FsBusManifestReq = {
  tx: string;
  id: FilesystemId;
  dir?: FilePath | FilePath[];
  cache?: boolean | 'force' | 'remove'; // (default: no-cache) Caches a version of index manifest in the directory for faster retrieval.
  cachefile?: string; // Used in conjuction with [cache] flag. Filename of the cached manifest to save.
};

export type FsBusManifestResEvent = {
  type: 'sys.fs/manifest:res';
  payload: FsBusManifestRes;
};
export type FsBusManifestRes = {
  tx: string;
  id: FilesystemId;
  dirs: FsBusManifestDirResponse[];
  error?: t.FsError;
};
