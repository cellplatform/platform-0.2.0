import { create } from './Cmd.impl';
import { DEFAULTS } from './common';
import { Events, Is, Patch, Path, Queue, toTransport } from './u';

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
   * Retrieve the hidden "transport" (immutable document).
   * NB: This is done as a hidden symbol so as to make the document
   *     available, but not as part of the main API to direct usage.
   */
  transport: toTransport,
} as const;
