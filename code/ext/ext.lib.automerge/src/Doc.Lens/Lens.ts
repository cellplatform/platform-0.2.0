import { init } from './Lens.impl';
import { Registry } from './Lens.Registry';

/**
 * Lens for operating on a sub-tree within a CRDT.
 */
export const Lens = {
  init,
  Registry,
} as const;
