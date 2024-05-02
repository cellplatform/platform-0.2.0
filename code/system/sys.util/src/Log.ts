import { type t } from './common';

/**
 * Console logging helpers.
 */
export const Log = {
  /**
   * Create a logger for the given level(s).
   */
  level(level?: t.LogLevelInput, options: { prefix?: string } = {}) {
    const levels = () => wrangle.levels(level);
    const includes = (level: t.LogLevel) => levels().includes(level);
    const format = (msg: any[]) => (options.prefix ? [options.prefix, ...msg] : msg);
    return {
      debug(...msg: any[]) {
        if (includes('Debug')) console.debug(...format(msg));
      },
      info(...msg: any[]) {
        if (includes('Info')) console.info(...format(msg));
      },
      warn(...msg: any[]) {
        if (includes('Warn')) console.warn(...format(msg));
      },
      error(...msg: any[]) {
        if (includes('Error')) console.error(...format(msg));
      },
    } as const;
  },
} as const;

/**
 * Helpers
 */
const wrangle = {
  levels(level: t.LogLevelInput) {
    if (level === undefined) return [];
    const value = typeof level === 'function' ? level() : level;
    return (Array.isArray(value) ? value : [value]).filter(Boolean);
  },
} as const;
