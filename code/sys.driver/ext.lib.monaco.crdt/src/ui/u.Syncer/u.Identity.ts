import { slug } from './common';

const UNKNOWN = 'UNKNOWN.';

/**
 * Helpers for working with identity.
 */
export const IdentityUtil = {
  /**
   * Resolve identity value.
   */
  format(value?: string) {
    return value ?? `${UNKNOWN}${slug()}`;
  },

  Is: {
    /**
     * Determine if the given value is a "unknown" type.
     */
    unknown(value: string = '') {
      if (!value.trim()) return true;
      return value.startsWith(UNKNOWN) && value.length > UNKNOWN.length;
    },
  },
} as const;
