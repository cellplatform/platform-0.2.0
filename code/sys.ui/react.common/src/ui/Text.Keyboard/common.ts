import { Pkg } from './common';

export { Keyboard } from 'sys.ui.dom';
export * from '../common';

/**
 * Constants
 */
export const DEFAULTS = {
  displayName: {
    EventProps: `${Pkg.name}.EventProps`,
  },
} as const;
