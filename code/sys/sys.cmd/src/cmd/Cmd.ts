import { create } from './Cmd.impl';
import { DEFAULTS } from './common';
import { Events, Patch, Path, Is } from './u';

/**
 * Command event structure on an observable/syncing CRDT.
 * Primitive for building up an actor model ("message passing computer").
 */
export const Cmd = {
  DEFAULTS,
  Is,
  Path,
  Patch,
  Events,
  create,
} as const;
