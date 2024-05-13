import type { t } from '../common';
import { DARK, WHITE } from './Color.const';
import { alpha } from './Color.format';

type Color = string | null;
const DEFAULT: t.CommonTheme = 'Light';

/**
 * A theme helper object.
 */
export function theme(name: t.CommonTheme = DEFAULT, defaultLight?: Color, defaultDark?: Color) {
  const fg = wrangle.color(name, defaultLight, defaultDark);
  const bg = wrangle.color(wrangle.opposite(name), defaultLight, defaultDark);
  return {
    name,
    fg,
    bg,
    is: { light: name === 'Light', dark: name === 'Dark' },
    alpha: {
      fg: (percent: t.Percent = 1) => alpha(fg, percent),
      bg: (percent: t.Percent = 1) => alpha(bg, percent),
    },
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
