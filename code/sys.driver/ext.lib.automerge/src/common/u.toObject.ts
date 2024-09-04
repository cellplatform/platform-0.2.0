import { R, Immutable } from './libs';

/**
 * Convert the given input to a simple object (deep).
 */
export function toObject<T>(input: T): T {
  if (input === null) return {} as T;
  if (typeof input !== 'object') return {} as T;
  if (Immutable.Is.map(input) || Immutable.Is.proxy(input)) return Immutable.toObject<T>(input);
  return R.clone(input) as unknown as T;
}
