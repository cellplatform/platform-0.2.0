import { DEFAULTS, type t } from './common';
import { Is } from './u.Is';

/**
 * Retrieve the hidden "transport" (immutable document).
 * NB: This is done as a hidden symbol so as to make the document
 *     available, but not as part of the main API to direct usage.
 */
export function toTransport<C extends t.CmdType>(cmd: t.Cmd<C>): t.CmdTransport {
  if (!Is.cmd(cmd)) throw new Error('Input not a <Cmd>');
  return (cmd as any)[DEFAULTS.symbol.transport] as t.CmdTransport;
}
