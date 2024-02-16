import { t, COLORS } from '../common';
import { link } from './Helpers.link';

type O = Record<string, unknown>;

/**
 * Simple helpers useful when workling with the [DevTools].
 */
export const Helpers = {
  link,

  /**
   * Toggle the value of a boolean {object} key.
   * WARNING:
   *    This manipulates the given object.
   *    Ensure an immutable-safe object is passed.
   */
  toggle<T extends O>(object: T, key: keyof T) {
    if (object === null || typeof object !== 'object') return false;

    const current = object[key];
    if (typeof current !== 'boolean' && current !== undefined) return false;

    const next = current === undefined ? true : !current;
    object[key] = next as T[keyof T];
    return next;
  },

  /**
   * Adjust the theme of the DevHarness.
   */
  theme(ctx: t.DevCtx, theme?: t.DevTheme) {
    if (theme === 'Light') {
      ctx.host.backgroundColor(null).tracelineColor(null);
    }
    if (theme === 'Dark') {
      ctx.host.backgroundColor(COLORS.DARK).tracelineColor(0.08);
    }
  },
} as const;
