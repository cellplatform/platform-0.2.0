import { t } from '../../common';

export * from '../common';
export { Button } from '../Button';

/**
 * Constants
 */
const card: t.PropListCard = {};
export const THEMES: t.PropListTheme[] = ['Light', 'Dark'];
export const DEFAULTS = {
  theme: THEMES[0],
  fontSize: 12,
  card,
};
