import { init } from './DocSync.impl.mjs';
import { toObject } from '../helpers';

/**
 * Extends a CRDT [DocRef] with peer-sync capabilities.
 */
export const DocSync = {
  init,
  toObject,
} as const;
