import { listen } from './Syncer.Cmd.listen';
import { Util } from './u';

/**
 * <Cmd> controller for the code-editor.
 */
export const SyncerCmd = {
  Util,
  listen,
} as const;
