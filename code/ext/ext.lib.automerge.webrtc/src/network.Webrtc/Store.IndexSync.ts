import { Local } from './Store.IndexSync.local';
import { Remote } from './Store.IndexSync.remote';

/**
 * Manages syncing an store/index via an networked ephemeral doc.
 */
export const IndexSync = {
  Local,
  local: Local.init,

  Remote,
  remote: Remote.init,
} as const;
