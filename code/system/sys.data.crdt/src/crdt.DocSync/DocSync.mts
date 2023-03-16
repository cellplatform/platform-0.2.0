import { createSyncDoc } from './DocSync.init.mjs';

/**
 * Extends a CRDT [DocRef] with peer-sync capabilities.
 */
export const DocSync = {
  init: createSyncDoc,
};
