import { Pkg, type t } from './common';

export { Sync } from '../../crdt.sync';
export * from '../common';

/**
 * Constants
 */
const paths: t.CmdBarPaths = {
  text: ['text'],
  tx: ['tx'],
};

const actions: t.CmdBarAction[] = ['Invoke'];

export const DEFAULTS = {
  displayName: `${Pkg.name}.CmdBar`,
  paths,
  actions,
} as const;
