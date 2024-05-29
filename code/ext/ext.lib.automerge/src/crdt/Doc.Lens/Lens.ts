import { A } from './common';
import { create } from './Lens.impl';
import { Registry } from './Lens.Registry';

/**
 * Lens for operating on a sub-tree within a CRDT.
 */
export const Lens = {
  create,
  Registry,
  splice: A.splice,
} as const;
