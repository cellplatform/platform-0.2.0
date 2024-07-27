import { Pkg, type t } from '../common';
export * from '../common';

/**
 * Constants
 */
const name = 'TODO:🐷';
const props: t.PickRequired<t.RootProps, 'theme'> = {
  theme: 'Dark',
};

export const DEFAULTS = {
  name,
  displayName: `${Pkg.name}:${name}`,
  props,
} as const;
