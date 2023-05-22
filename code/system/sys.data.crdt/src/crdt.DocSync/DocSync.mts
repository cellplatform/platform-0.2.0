import { init } from './DocSync.init.mjs';
import { toObject } from '../crdt.helpers';

/**
 * Extends a CRDT [DocRef] with peer-sync capabilities.
 */
export const DocSync = {
  init,
  toObject,
};
