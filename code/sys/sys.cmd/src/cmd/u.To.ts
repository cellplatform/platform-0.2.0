import { DEFAULTS, type t } from './common';
import { Is } from './u.Is';

/**
 * Retrieve the hidden "transport" (immutable document) from a command.
 * NB: This is done as a hidden symbol so as to make the document
 *     available, but not as part of the main API to direct usage.
 */
export function toTransport(cmd: any): t.CmdTransport {
  if (!Is.cmd(cmd)) throw new Error('Input not a <Cmd>');
  return (cmd as any)[DEFAULTS.symbol.transport] as t.CmdTransport;
}

/**
 * Retrieve the hidden "paths" field from a command.
 * NB: This is done as a hidden symbol so as to make the document
 *     available, but not as part of the main API to direct usage.
 */
export function toPaths(cmd: any): t.CmdPaths {
  if (!Is.cmd(cmd)) throw new Error('Input not a <Cmd>');
  return (cmd as any)[DEFAULTS.symbol.paths] as t.CmdPaths;
}
