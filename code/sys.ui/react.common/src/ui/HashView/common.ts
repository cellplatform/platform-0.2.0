import { Pkg, type t } from '../common';

export * from '../common';
export { Button } from '../Button';
export { Icons } from '../Icons';

/**
 * Constants
 */
const name = 'HashView';
export const DEFAULTS = {
  name,
  displayName: `${Pkg.name}:${name}`,
  title: 'Hash',
} as const;
