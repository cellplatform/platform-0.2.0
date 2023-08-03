import { type t } from '../common';

export * from '../common';
export { VideoDiagram } from '../ui.VideoDiagram__';
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
