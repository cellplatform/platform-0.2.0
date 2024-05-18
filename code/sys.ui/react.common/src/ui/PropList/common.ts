import type { t } from '../../common';

export { Button } from '../Button';
export { Chip } from '../Chip';

export * from '../common';

/**
 * Constants
 */
const theme: t.CommonTheme = 'Light';
export const DEFAULTS = {
  theme,
  fontSize: { sans: 12, mono: 11 },
  messageDelay: 1500,
} as const;
