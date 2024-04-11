import type * as t from './t';

import { IS_PROD } from './constants';
import { Is, Value } from './libs';

/**
 * Safely serializes data to a JSON string.
 */
export function stringify(data: any, errorMessage: () => string) {
  try {
    return data ? JSON.stringify(data) : '';
  } catch (err: any) {
    let message = errorMessage();
    message = !IS_PROD ? `${message} ${err.message}` : message;
    throw new Error(message);
  }
}

/**
 * Attempts to parse JSON.
 */
export function parseJson(args: { url: string; text: string }) {
  const text = args.text;
  try {
    return (typeof text === 'string' && Is.json(args.text) ? JSON.parse(text) : text) as t.Json;
  } catch (error: any) {
    const body = text ? text : '<empty>';
    const msg = `Failed while parsing JSON for '${args.url}'.\nParse Error: ${error.message}\nBody: ${body}`;
    throw new Error(msg);
  }
}

/**
 * Converts fetch [Headers] to a simple object.
 */
export function toRawHeaders(input?: t.HttpHeaders, defaultContentType?: boolean | string) {
  const obj = { ...input } as any;
  Object.keys(obj).forEach((key) => (obj[key] = obj[key].toString()));
  if (defaultContentType && !headerValue('content-type', obj)) {
    obj['content-type'] = defaultContentType === true ? 'application/json' : defaultContentType;
  }
  return new Headers(obj);
}

/**
 * Converts fetch [Headers] to a simple object.
 */
export function fromRawHeaders(input: Headers): t.HttpHeaders {
  const hasEntries = typeof input.entries === 'function';
  const obj = hasEntries
    ? walkHeaderEntries(input) // NB: Properly formed fetch object (probably in browser)
    : ((input as any) || {})._headers || {}; // HACK: reach into the server object's internals.

  return Object.keys(obj).reduce((acc, key) => {
    const value = Array.isArray(obj[key]) ? obj[key][0] : obj[key];
    const typedValue = Value.toType<any>(value);
    acc[key] = typedValue;
    return acc;
  }, {} as any);
}

/**
 * Retrieve the value for the given header.
 */
export function headerValue(key: string, headers: t.HttpHeaders | Headers = {}) {
  key = key.trim().toLowerCase();
  const obj = headers instanceof Headers ? fromRawHeaders(headers) : headers;
  const match =
    Object.keys(obj)
      .filter((k) => k.trim().toLowerCase() === key)
      .find((k) => obj[k]) || '';
  return match ? obj[match] : '';
}

/**
 * Determine if the given headers reperesents form data.
 */
export function isFormData(headers: t.HttpHeaders = {}) {
  const contentType = headerValue('content-type', headers);
  return contentType.includes('multipart/form-data');
}

/**
 * Determine if the given body value represents a stream.
 */
export function isStream(input?: ReadableStream<Uint8Array>) {
  return input instanceof ReadableStream || typeof (input as any).pipe === 'function';
}

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
