import { type t } from './common';

type L = t.LogLevel | t.LogLevel[];

/**
 * Console logging helpers.
 */
export const Log = {
  /**
   * Create a logger for the given level(s).
   */
  level(level?: L) {
    const levels = wrangle.levels(level);
    return {
      debug(...msg: any[]) {
        if (levels.includes('Debug')) console.debug(...msg);
      },
      info(...msg: any[]) {
        if (levels.includes('Info')) console.info(...msg);
      },
      warn(...msg: any[]) {
        if (levels.includes('Warn')) console.warn(...msg);
      },
      error(...msg: any[]) {
        if (levels.includes('Error')) console.error(...msg);
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
