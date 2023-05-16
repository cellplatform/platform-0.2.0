import { init } from './DocRef.init.mjs';
import { toObject } from '../crdt.helpers';

/**
 * In-memory CRDT document reference (wrapper).
 */
export const DocRef = {
  init,
  toObject,
};
