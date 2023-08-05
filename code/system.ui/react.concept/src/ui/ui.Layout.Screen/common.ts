import { type t } from '../common';

export * from '../common';
export { PlayBar } from '../ui.PlayBar';

/**
 * Constants
 */
const focused: t.ScreenLayoutFocused | undefined = undefined;

export const DEFAULTS = {
  focused,
  text: {
    nothingSelected: 'Nothing selected.',
    nothingToDisplay: 'Nothing to display.',
  },
} as const;
