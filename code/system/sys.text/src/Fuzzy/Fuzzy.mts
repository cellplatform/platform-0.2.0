import { t } from '../common.t';
import search from 'approx-string-match';

/**
 * Approximate string matching.
 */
export const Fuzzy: t.Fuzzy = {
  /**
   * Match using the given "input" pattern.
   */
  pattern(pattern: string, maxErrors = 2) {
    return {
      /**
       * Match on the given target string value.
       */
      match(input?: string) {
        const text = input ?? '';
        const matches = search(text, pattern, maxErrors);
        return {
          exists: matches.length > 0,
          matches,
          pattern,
          text,
          get range() {
            const start = matches[0]?.start ?? -1;
            const end = matches[matches.length - 1]?.end ?? -1;
            const exists = start !== -1 && end !== -1;
            return { start, end, text: exists ? text.substring(start, end) : '' };
          },
        };
      },
    };
  },
};
