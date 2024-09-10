import { create } from './Cmd.impl';
import { DEFAULTS } from './common';
import { Events, Is, Patch, Path, Queue, toPaths, toTransport, toIssuer } from './u';

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
  Queue,

  /**
   * Factory.
   */
  create,

  /**
   * Helpers.
   */
  autopurge: Queue.autopurge,
  toTransport,
  toPaths,
  toIssuer,
} as const;
