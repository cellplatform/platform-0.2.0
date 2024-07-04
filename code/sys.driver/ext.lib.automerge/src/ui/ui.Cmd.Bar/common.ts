import { Cmd, Pkg, type t } from '../common';

export { CmdBar as BaseComponent } from 'sys.ui.react.common';
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
  displayName: `${Pkg.name}:CmdBar`,
  paths,
  error: Cmd.DEFAULTS.error,
} as const;
