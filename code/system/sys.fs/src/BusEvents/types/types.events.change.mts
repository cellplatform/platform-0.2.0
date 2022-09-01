import { t } from './common.mjs';

type FilesystemId = string;

export type SysFsChange = SysFsChangeWrite | SysFsChangeCopy | SysFsChangeMove | SysFsChangeDelete;
export type SysFsChangeWrite = { op: 'write'; files: t.FsBusFileWriteResponse[] };
export type SysFsChangeCopy = { op: 'copy'; files: t.FsBusFileCopyResponse[] };
export type SysFsChangeMove = { op: 'move'; files: t.FsBusFileMoveResponse[] };
export type SysFsChangeDelete = { op: 'delete'; files: t.FsBusFileDeleteResponse[] };

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
