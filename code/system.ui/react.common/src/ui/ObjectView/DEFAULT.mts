import { type t } from '../common';

const theme: t.ObjectViewTheme = 'Light';

export const DEFAULTS = {
  theme,
  font: { size: 12 },
  showRootSummary: true,
  showNonenumerable: false,
} as const;
