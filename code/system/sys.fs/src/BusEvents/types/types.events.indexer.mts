import { t } from './common.mjs';

type FilesystemId = string;
type FilePath = string;

export type SysFsManifestDirResponse = {
  dir: FilePath;
  manifest: t.DirManifest;
  error?: t.FsError;
};

/**
 * EVENTS
 */
export type SysFsIndexEvent = SysFsManifestReqEvent | SysFsManifestResEvent;

/**
 * Manifest index of directory.
 */
export type SysFsManifestReqEvent = {
  type: 'sys.fs/manifest:req';
  payload: SysFsManifestReq;
};
export type SysFsManifestReq = {
  tx: string;
  id: FilesystemId;
  dir?: FilePath | FilePath[];
  cache?: boolean | 'force' | 'remove'; // (default: no-cache) Caches a version of index manifest in the directory for faster retrieval.
  cachefile?: string; // Used in conjuction with [cache] flag. Filename of the cached manifest to save.
};

export type SysFsManifestResEvent = {
  type: 'sys.fs/manifest:res';
  payload: SysFsManifestRes;
};
export type SysFsManifestRes = {
  tx: string;
  id: FilesystemId;
  dirs: SysFsManifestDirResponse[];
  error?: t.FsError;
};
