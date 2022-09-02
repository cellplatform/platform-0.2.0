import type * as t from '../common/types.mjs';

type FilesystemId = string;
type FilePath = string;

/**
 * Filesystem controller instance.
 */
export type SysFsController = t.Disposable & {
  id: FilesystemId;
  dir: FilePath;
  events: t.FsBusEvents;
  fs: t.FsBusEvents['fs'];
};
