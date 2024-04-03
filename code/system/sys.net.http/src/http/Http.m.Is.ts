import { Value } from './common';

/**
 * Helper flags
 */
export const HttpIs = {
  /**
   * Determine if the given object is a native [Headers] object.
   */
  nativeHeaders(input?: any): input is Headers {
    if (!input || input === null || typeof input !== 'object') return false;
    if (input instanceof Headers) return true;
    if (Value.Is.plainObject(input)) return false;

    const obj = input as Headers;
    return typeof obj.getSetCookie === 'function' && typeof obj.has === 'function';
  },
} as const;
