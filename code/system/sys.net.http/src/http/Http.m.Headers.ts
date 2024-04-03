import { HttpIs } from './Http.m.Is';
import { DEFAULTS, type t } from './common';

/**
 * Helpers for working with headers
 */
export const HttpHeaders = {
  mime: DEFAULTS.mime,

  /**
   * Retrieve the value for the given header.
   */
  value(headers: t.HttpHeaders | Headers | undefined, key: string) {
    key = key.trim().toLowerCase();
    const obj = (HttpIs.nativeHeaders(headers) ? HttpHeaders.fromRaw(headers) : headers) || {};
    const matchKey =
      Object.keys(obj)
        .filter((k) => k.trim().toLowerCase() === key)
        .find((k) => obj[k]) || '';
    return matchKey ? obj[matchKey] : '';
  },

  /**
   * Converts fetch [Headers] to a simple object.
   */
  toRaw(input?: t.HttpHeaders, defaultContentType?: boolean | string) {
    const obj = { ...input } as any;
    Object.keys(obj).forEach((key) => (obj[key] = obj[key].toString()));
    if (defaultContentType && !HttpHeaders.value(obj, 'content-type')) {
      obj['content-type'] = defaultContentType === true ? 'application/json' : defaultContentType;
    }
    return new Headers(obj);
  },

  /**
   * Converts fetch [Headers] to a simple object.
   */
  fromRaw(input: Headers): t.HttpHeaders {
    const hasEntries = typeof input.entries === 'function';
    const obj = hasEntries
      ? walkHeaderEntries(input) // NB: Properly formed fetch object (probably in browser)
      : ((input as any) || {})._headers || {}; // HACK: reach into the server object's internals.

    return Object.keys(obj).reduce((acc, key) => {
      const value = Array.isArray(obj[key]) ? obj[key][0] : obj[key];
      acc[key] = value;
      return acc;
    }, {} as any);
  },
} as const;

/**
 * Helpers
 */
const walkHeaderEntries = (input: Headers) => {
  const res: t.HttpHeaders = {};
  const entries = input.entries();
  let next: IteratorResult<[string, string], any> | undefined;
  do {
    next = entries.next();
    if (next.value) {
      const [key, value] = next.value;
      res[key] = value;
    }
  } while (!next?.done);
  return res;
};
