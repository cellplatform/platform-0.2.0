import type { ObjectViewTheme } from './types.mjs';

const theme: ObjectViewTheme = 'Light';

export const DEFAULTS = {
  theme,
  font: { size: 12 },
  showRootSummary: true,
  showNonenumerable: false,
} as const;
