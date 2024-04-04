import { Value, type t } from './common';

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

  /**
   * Determine if the given object is a set of HTTP method helpers.
   */
  methods(input?: any): input is t.HttpMethods {
    if (!input || input === null || typeof input !== 'object') return false;
    const obj = input as t.HttpMethods;
    return (
      typeof obj.get === 'function' &&
      typeof obj.put === 'function' &&
      typeof obj.post === 'function' &&
      typeof obj.patch === 'function' &&
      typeof obj.delete === 'function'
    );
  },
} as const;
