import { Pkg, type t } from '../common';
export * from '../common';

/**
 * Constants
 */
const paths: t.CmdBarStatefulPaths = {
  text: ['text'],
};

const name = 'CmdBar.Stateful';
export const DEFAULTS = {
  name,
  displayName: `${Pkg.name}.${name}`,
  paths,
} as const;
