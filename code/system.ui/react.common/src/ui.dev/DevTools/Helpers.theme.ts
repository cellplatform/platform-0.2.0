import { COLORS, type t, Is } from '../common';

/**
 * Helpers for working with common themes within the harness.
 */
export const theme = {
  /**
   * Adjust the theme of the DevHarness.
   */
  background(ctx: t.DevCtx, theme?: t.DevTheme) {
    if (theme === 'Light') {
      ctx.host.backgroundColor(null).tracelineColor(null);
    }
    if (theme === 'Dark') {
      ctx.host.backgroundColor(COLORS.DARK).tracelineColor(0.08);
    }
  },
} as const;
