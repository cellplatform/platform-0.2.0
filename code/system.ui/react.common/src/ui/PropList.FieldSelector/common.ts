export * from '../common';
export { Button } from '../Button';

/**
 * Constants
 */
export const DEFAULTS = {
  indexes: true,
  indent: 0,
  resettable: true,
  label: {
    reset: 'reset',
    clear: 'clear',
  },
} as const;
