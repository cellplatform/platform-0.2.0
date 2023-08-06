import { type t } from './common';

export * from '../common';

/**
 * Constants
 */
export const DEFAULTS = {
  untitled: 'Untitled',
  focused: false,
  editing: false,
  selected: undefined, // index.
} as const;
