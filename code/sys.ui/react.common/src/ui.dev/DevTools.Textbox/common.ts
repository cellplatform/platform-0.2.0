import { Pkg, type t } from '../common';
export * from '../common';

/**
 * Constants
 */
export const DEFAULTS = {
  displayName: `${Pkg.name}:DevTools.Textbox`,
  isEnabled: true,
  placeholder: 'enter text here...',
} as const;
