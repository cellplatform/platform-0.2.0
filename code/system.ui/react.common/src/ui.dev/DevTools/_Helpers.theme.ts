import { COLORS, type t } from '../common';

/**
 * Helpers for working with common themes within the harness.
 */
export const Theme = {
  is(theme: t.CommonTheme) {
    return { dark: theme === 'Dark', light: theme === 'Light' } as const;
  },

  /**
   * Adjust the theme of the DevHarness.
   */
  background(ctx: t.DevCtx, value: t.CommonTheme = 'Light') {
    const is = Theme.is(value);
    if (value === 'Light') {
      ctx.host.backgroundColor(null).tracelineColor(null);
    }
    if (value === 'Dark') {
      ctx.host.backgroundColor(COLORS.DARK).tracelineColor(0.08);
    }
  },
} as const;
