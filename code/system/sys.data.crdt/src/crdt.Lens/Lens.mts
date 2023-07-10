import { init } from './Lens.impl.mjs';
import { Registry } from './Lens.Registry.mjs';
import { namespace } from './Lens.Namespace.mjs';

/**
 * Lens for operating on a sub-tree within a CRDT.
 */
export const CrdtLens = {
  init,
  namespace,
  Registry,
} as const;
