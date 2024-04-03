import { HttpIs } from './Http.m.Is';
import { DEFAULTS, type t } from './common';

import type { IncomingHttpHeaders, OutgoingHttpHeaders } from 'node:http';
type RawHeadersInput = Headers | IncomingHttpHeaders | OutgoingHttpHeaders;

/**
 * Helpers for working with headers
 */
export const HttpHeaders = {
  mime: DEFAULTS.mime,

  /**
   * Retrieve the value for the given header.
   */
  value(headers: t.HttpHeaders | RawHeadersInput | undefined, key: string): string {
    key = key.trim().toLowerCase();
    const obj = (HttpIs.nativeHeaders(headers) ? HttpHeaders.fromRaw(headers) : headers) || {};
    const matchKey =
      Object.keys(obj)
        .filter((k) => k.trim().toLowerCase() === key)
        .find((k) => obj[k]) || '';
    return String(matchKey ? obj[matchKey] : '');
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
  fromRaw(input: RawHeadersInput): t.HttpHeaders {
    const res: t.HttpHeaders = {};
    wrangle.entries(input).forEach(([key, value]) => (res[key] = value));
    return res;
  },
} as const;

/**
 * Helpers
 */
const wrangle = {
  entries(headers: RawHeadersInput): [string, string][] {
    if (typeof headers.entries === 'function') return Array.from(headers.entries());
    return Object.entries(headers).map(([key, value]) => {
      return [key, Array.isArray(value) ? value.join('; ') : value];
    });
  },
} as const;
