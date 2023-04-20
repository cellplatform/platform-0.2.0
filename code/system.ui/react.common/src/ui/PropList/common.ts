import { t } from '../../common';

export * from '../common';
export { Button } from '../Button';

/**
 * Constants
 */

export const THEMES: t.PropListTheme[] = ['Light', 'Dark'];
export const DEFAULTS = {
  theme: THEMES[0],
  fontSize: 12,
  get card() {
    return { flipSpeed: 300, shadow: true };
  },
};
