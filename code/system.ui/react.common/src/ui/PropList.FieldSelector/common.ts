import { COLORS } from '../common';

export * from '../common';
export { Button } from '../Button';

/**
 * Constants
 */
export const DEFAULTS = {
  indexes: true,
  indent: 0,
  resettable: true,
  autoSubfieldSelection: false,
  switchColor: COLORS.BLUE,
  label: {
    reset: 'reset',
    clear: 'clear',
  },
} as const;
