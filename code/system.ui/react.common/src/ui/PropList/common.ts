import { t } from '../../common';

export { Button } from '../Button';
export * from '../common';

/**
 * Constants
 */

export const THEMES: t.PropListTheme[] = ['Light', 'Dark'];

export const DEFAULTS = {
  theme: THEMES[0],
  fontSize: 12,
  messageDelay: 1500,
  get card() {
    return { flipSpeed: 300, shadow: true };
  },
} as const;
