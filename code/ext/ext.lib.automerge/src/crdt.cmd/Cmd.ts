import { DEFAULTS } from './common';
import { Events, Path } from './u';
import { create } from './Cmd.impl';

/**
 * Command event structure on an observable/syncing CRDT.
 * Primitive for building up an actor model ("message passing computer").
 */
export const Cmd = {
  DEFAULTS,
  Path,
  Events,
  create,
} as const;
