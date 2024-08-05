import { listen } from './Syncer.listen';
import { SyncerCmd as Cmd } from './Syncer.Cmd';

/**
 * Tools for syncing a MonacoEditor with a CRDT Lens<T>.
 */
export const Syncer = {
  listen,
  Cmd,
} as const;
