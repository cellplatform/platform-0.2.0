import { t } from './common.mjs';

type FilesystemId = string;

export type SysFsChange = SysFsChangeWrite | SysFsChangeCopy | SysFsChangeMove | SysFsChangeDelete;
export type SysFsChangeWrite = { op: 'write'; files: t.SysFsFileWriteResponse[] };
export type SysFsChangeCopy = { op: 'copy'; files: t.SysFsFileCopyResponse[] };
export type SysFsChangeMove = { op: 'move'; files: t.SysFsFileMoveResponse[] };
export type SysFsChangeDelete = { op: 'delete'; files: t.SysFsFileDeleteResponse[] };

/**
 * EVENTS
 */

/**
 * Filesystem change event.
 */
export type SysFsChangedEvent = {
  type: 'sys.fs/changed';
  payload: SysFsChanged;
};
export type SysFsChanged = {
  id: FilesystemId;
  change: SysFsChange;
};
