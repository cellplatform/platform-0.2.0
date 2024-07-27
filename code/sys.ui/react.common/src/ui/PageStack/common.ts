import { Pkg, type t } from '../common';
export * from '../common';

/**
 * Constants
 */
const name = 'PageStack';
const props: t.PickRequired<t.PageStackProps, 'theme' | 'transition' | 'total' | 'current'> = {
  theme: 'Dark',
  total: 5,
  current: 0,
  transition: 300,
};
export const DEFAULTS = {
  name,
  displayName: `${Pkg.name}:${name}`,
  props,
} as const;
