import { type t } from './common';

type FilesystemId = string;

export type FsBusChange = FsBusChangeWrite | FsBusChangeCopy | FsBusChangeMove | FsBusChangeDelete;
export type FsBusChangeWrite = { op: 'write'; files: t.FsBusFileWriteResponse[] };
export type FsBusChangeCopy = { op: 'copy'; files: t.FsBusFileCopyResponse[] };
export type FsBusChangeMove = { op: 'move'; files: t.FsBusFileMoveResponse[] };
export type FsBusChangeDelete = { op: 'delete'; files: t.FsBusFileDeleteResponse[] };

/**
 * EVENTS
 */

/**
 * Filesystem change event.
 */
export type FsBusChangedEvent = {
  type: 'sys.fs/changed';
  payload: FsBusChanged;
};
export type FsBusChanged = {
  id: FilesystemId;
  change: FsBusChange;
};
