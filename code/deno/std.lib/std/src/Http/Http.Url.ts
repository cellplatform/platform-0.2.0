import { type t } from '../common.ts';
import { Path } from '../Path/mod.ts';

/**
 * Helpers for a URL used within an HTTP fetch client.
 */
export const HttpUrl = {
  /**
   * URL factory.
   */
  create(base: string): t.HttpUrl {
    const { url, error } = wrangle.asUrl(base);
    if (error) throw error;
    base = url.href;
    return {
      base,
      join(...parts: string[]) {
        const path = Path.join(url.pathname, ...parts);
        return `${url.origin}/${path.replace(/^\/*/, '')}`;
      },
      toString() {
        return base;
      },
    };
  },
} as const;

/**
 * Helpers
 */
const wrangle = {
  asUrl(base: string) {
    try {
      const url = new URL(base);
      return { url };
    } catch (err: any) {
      const error = new Error(`Invalid base URL: ${String(base)}`);
      return { error };
    }
  },
} as const;
