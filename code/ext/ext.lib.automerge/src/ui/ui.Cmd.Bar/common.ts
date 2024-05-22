import { Pkg, type t } from './common';

export { Sync } from '../../crdt.sync';
export * from '../common';

/**
 * Constants
 */
const paths: t.CmdBarPaths = {
  text: ['text'],
  invoked: ['invoked'],
};

export const DEFAULTS = {
  displayName: `${Pkg.name}.CmdBar`,
  paths,
} as const;
