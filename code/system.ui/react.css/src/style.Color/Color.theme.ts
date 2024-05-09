import type { t } from '../common';
import { DARK, WHITE } from './Color.const';
import { alpha } from './Color.format';

const DEFAULT: t.CommonTheme = 'Light';

/**
 * A theme helper object.
 */
export function theme(
  name: t.CommonTheme = DEFAULT,
  defaultLight?: string | null,
  defaultDark?: string | null,
) {
  const color = fromTheme(name, defaultLight, defaultDark);
  return {
    name,
    color,
    is: { light: name === 'Light', dark: name === 'Dark' },
    alpha: (percent: t.Percent = 1) => alpha(color, percent),
  } as const;
}

/**
 * Base text/fore color derived from common theme name.
 */
function fromTheme(
  theme: t.CommonTheme = DEFAULT,
  defaultLight?: string | null,
  defaultDark?: string | null,
) {
  const light = defaultLight ?? DARK;
  const dark = defaultDark ?? WHITE;
  return theme === 'Dark' ? dark : light;
}
