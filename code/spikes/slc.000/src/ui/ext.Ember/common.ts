import { type t } from '../common';

export * from '../common';

/**
 * Constants
 */
const focused: t.RootPropsFocused | undefined = undefined;

export const DEFAULTS = {
  focused,
  text: {
    nothingSelected: 'Nothing selected.',
    nothingToDisplay: 'Nothing to display.',
  },
} as const;
