import { type t } from '../../common';

export { Button } from '../Button';
export { Card } from '../Card';
export { Wrangle as WrangleCard } from '../Card/Wrangle.mjs';
export { Chip } from '../Chip';

export * from '../common';

/**
 * Constants
 */
export const THEMES: t.PropListTheme[] = ['Light', 'Dark'];
export const DEFAULTS = {
  theme: THEMES[0],
  fontSize: { sans: 12, mono: 11 },
  messageDelay: 1500,
} as const;
