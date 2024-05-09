import { init } from './DocFile.impl.mjs';
import { toObject } from '../helpers';

/**
 * Extends a CRDT [DocRef] with file-system persistence.
 */
export const DocFile = {
  init: init,
  toObject,
} as const;
