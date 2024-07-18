import { Pkg, type t } from '../common';
export * from '../common';

/**
 * Constants
 */
const name = 'DocStack';
const props: t.PickRequired<t.DocStackProps, 'theme'> = {
  theme: 'Dark',
};
export const DEFAULTS = {
  name,
  displayName: `${Pkg.name}:${name}`,
  props,
  total: 5,
} as const;
