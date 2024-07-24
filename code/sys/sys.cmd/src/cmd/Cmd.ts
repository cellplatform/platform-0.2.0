import { create } from './Cmd.impl';
import { DEFAULTS, type t } from './common';
import { Events, Is, Patch, Path } from './u';

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

  /**
   * Factory.
   */
  create,

  /**
   * Retrieve the hidden "transport" (immutable document).
   * NB: This is done as a hidden symbol so as to make the document
   *     available, but not as part of the main API to direct usage.
   */
  transport(cmd: any): t.CmdTransport {
    if (!Is.cmd(cmd)) throw new Error('Input not a <Cmd>');
    return (cmd as any)[DEFAULTS.symbol.transport] as t.CmdTransport;
  },
} as const;
