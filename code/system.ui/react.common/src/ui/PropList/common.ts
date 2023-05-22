import { t } from '../../common';

export * from '../common';
export { Button } from '../Button';
export { Card } from '../Card';
export { Wrangle as WrangleCard } from '../Card/Wrangle.mjs';
export { Chip } from '../Chip';

/**
 * Constants
 */
export const THEMES: t.PropListTheme[] = ['Light', 'Dark'];
export const DEFAULTS = {
  theme: THEMES[0],
  fontSize: 12,
  messageDelay: 1500,
} as const;
