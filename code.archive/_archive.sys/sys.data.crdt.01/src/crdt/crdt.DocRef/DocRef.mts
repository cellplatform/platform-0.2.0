import { init } from './DocRef.impl.mjs';
import { toObject } from '../helpers';

/**
 * In-memory CRDT document reference (wrapper).
 */
export const DocRef = {
  init,
  toObject,
} as const;
