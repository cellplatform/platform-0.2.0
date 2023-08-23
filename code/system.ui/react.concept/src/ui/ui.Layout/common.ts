import { type t } from '../common';

export * from '../common';
// export { PlayBar } from '../ui.PlayBar__';
export { Empty } from '../ui.Empty';

/**
 * Constants
 */
const focused: t.LayoutFocused | undefined = undefined;

export const DEFAULTS = {
  focused,
  text: {
    nothingSelected: 'Nothing selected.',
    nothingToDisplay: 'Nothing to display.',
  },
} as const;
