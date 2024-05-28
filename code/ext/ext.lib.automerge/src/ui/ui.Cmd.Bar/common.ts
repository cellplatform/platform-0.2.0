import { Cmd } from '../../crdt.cmd';
import { Pkg, type t } from './common';

export { Doc } from '../../crdt';
export { Sync } from '../../crdt.sync';
export { Cmd };

export * from '../common';

/**
 * Constants
 */
const paths: t.CmdBarPaths = {
  text: ['text'],
  cmd: Cmd.Path.prepend(Cmd.DEFAULTS.paths, ['cmd']),
};

export const DEFAULTS = {
  displayName: `${Pkg.name}.CmdBar`,
  paths,
} as const;
