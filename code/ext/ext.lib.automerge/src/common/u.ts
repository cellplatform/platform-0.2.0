import { R } from './libs';

/**
 * Convert the given input to a simple object (deep).
 */
export function toObject<T>(input: any): T {
  if (input === null) return {} as T;
  if (typeof input !== 'object') return {} as T;
  if (Array.isArray(input)) return {} as T;
  return R.clone(input);
}
