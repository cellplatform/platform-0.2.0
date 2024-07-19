import { Pkg, type t } from '../common';
export * from '../common';

/**
 * Constants
 */
const name = 'PageStack';
const props: t.PickRequired<t.PageStackProps, 'theme' | 'transitionTime'> = {
  theme: 'Dark',
  transitionTime: 300,
};
export const DEFAULTS = {
  name,
  displayName: `${Pkg.name}:${name}`,
  props,
  total: 5,
} as const;
