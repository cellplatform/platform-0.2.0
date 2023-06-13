import { init } from './Lens.impl.mjs';
import { Registry } from './Lens.Registry.mjs';

/**
 * Lens for operating on a sub-tree within a CRDT.
 */
export const CrdtLens = {
  init,
  Registry,
} as const;
