import { create } from './Cmd.impl';
import { DEFAULTS } from './common';
import { Events, Is, Patch, Path, Queue, toPaths, toTransport } from './u';

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
  transport: toTransport,
  paths: toPaths,
  autopurge: Queue.autopurge,
} as const;
