import { type t } from './common';
type L = t.LogLevel | t.LogLevel[];

/**
 * Console logging helpers.
 */
export const Log = {
  /**
   * Create a logger for the given level(s).
   */
  level(level?: L, options: { prefix?: string } = {}) {
    const levels = wrangle.levels(level);
    const format = (msg: any[]) => (options.prefix ? [options.prefix, ...msg] : msg);
    return {
      debug(...msg: any[]) {
        if (levels.includes('Debug')) console.debug(...format(msg));
      },
      info(...msg: any[]) {
        if (levels.includes('Info')) console.info(...format(msg));
      },
      warn(...msg: any[]) {
        if (levels.includes('Warn')) console.warn(...format(msg));
      },
      error(...msg: any[]) {
        if (levels.includes('Error')) console.error(...format(msg));
      },
    } as const;
  },
} as const;

/**
 * Helpers
 */
const wrangle = {
  levels(level?: L) {
    if (level === undefined) return [];
    return Array.isArray(level) ? level : [level];
  },
} as const;
