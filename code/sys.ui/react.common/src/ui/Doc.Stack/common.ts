import { Pkg, type t } from '../common';
export * from '../common';

/**
 * Constants
 */
const name = 'DocStack';
const props: t.PickRequired<t.DocStackProps, 'total' | 'theme' | 'height'> = {
  total: 5,
  height: 20,
  theme: 'Dark',
};
export const DEFAULTS = {
  name,
  displayName: `${Pkg.name}:${name}`,
  props,
} as const;
