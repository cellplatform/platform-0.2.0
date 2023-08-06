import { type t } from './common';

export * from '../common';
export { Icons } from '../Icons.mjs';

/**
 * Constants
 */
export const DEFAULTS = {
  untitled: 'Untitled',
  focused: false,
  editing: false,
  selected: undefined, // index.
  scroll: true,
} as const;
