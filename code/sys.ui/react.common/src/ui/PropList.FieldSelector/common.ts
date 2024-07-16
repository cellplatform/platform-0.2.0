import { COLORS, Pkg } from '../common';

export { Button } from '../Button';
export * from '../common';

/**
 * Constants
 */
export const DEFAULTS = {
  displayName: `${Pkg.name}:PropList.FieldSelector`,
  indexes: true,
  indent: 0,
  resettable: true,
  switchColor: COLORS.BLUE,
  label: {
    reset: 'reset',
    clear: 'clear',
  },
} as const;
