import type { t } from '../common';
import { DARK, WHITE } from './Color.const';
import { alpha } from './Color.format';

const DEFAULT: t.CommonTheme = 'Light';
type Color = string | null;

/**
 * A theme helper object.
 */
export function theme(name: t.CommonTheme = DEFAULT, defaultLight?: Color, defaultDark?: Color) {
  const color = wrangle.color(name, defaultLight, defaultDark);
  const background = wrangle.color(wrangle.opposite(name), defaultLight, defaultDark);
  return {
    name,
    color,
    background,
    is: { light: name === 'Light', dark: name === 'Dark' },
    alpha: (percent: t.Percent = 1) => alpha(color, percent),
  } as const;
}

/**
 * Helpers
 */
const wrangle = {
  color(theme: t.CommonTheme = DEFAULT, defaultLight?: Color, defaultDark?: Color) {
    const light = defaultLight ?? DARK;
    const dark = defaultDark ?? WHITE;
    return theme === 'Dark' ? dark : light;
  },

  opposite(theme: t.CommonTheme = DEFAULT): t.CommonTheme {
    return theme === 'Dark' ? 'Light' : 'Dark';
  },
} as const;
