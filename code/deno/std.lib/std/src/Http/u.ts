import { type t } from './common.ts';

/**
 * Convert a [Header] object into a simple {key/value} object.
 */
export function toHeaders(input: Headers) {
  const res: any = {};
  input.forEach((value, key) => (res[key] = value));
  return res;
}
