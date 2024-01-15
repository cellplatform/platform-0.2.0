import { init } from './Lens.impl';
import { Registry } from './Lens.Registry';
import { namespace } from '../Doc.Lens.Namespace/namespace';

/**
 * Lens for operating on a sub-tree within a CRDT.
 */
export const DocLens = {
  init,
  namespace,
  Registry,
} as const;
