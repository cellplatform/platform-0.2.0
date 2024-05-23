import { Pkg, type t, DEFAULTS } from './common';
import { Path } from './u';

/**
 * Command event structure on an observable/syncing CRDT.
 * Primitive for building up an actor model ("message passing computer").
 */
export const Cmd = {
  DEFAULTS,
  Path,
} as const;
