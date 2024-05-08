import type { t } from '../common';
import { DARK, WHITE } from './Color.const';

const DEFAULT_THEME: t.CommonTheme = 'Light';

/**
 * Base text/fore color derived from common theme name.
 */
export function fromTheme(
  theme: t.CommonTheme = DEFAULT_THEME,
  defaultLight?: string | null,
  defaultDark?: string | null,
) {
  const light = defaultLight ?? DARK;
  const dark = defaultDark ?? WHITE;
  return theme === 'Dark' ? dark : light;
}

/**
 * A theme helper object.
 */
export function theme(
  name: t.CommonTheme = DEFAULT_THEME,
  defaultLight?: string | null,
  defaultDark?: string | null,
) {
  return {
    name,
    color: fromTheme(name, defaultLight, defaultDark),
    is: {
      light: name === 'Light',
      dark: name === 'Dark',
    },
  } as const;
}
