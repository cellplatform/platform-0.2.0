import { Immutable, R } from './libs';
import { Is } from './u.Is';

/**
 * Convert the given input to a simple object (deep).
 */
export function toObject<T>(input: T): T {
  if (input === null) return {} as T;
  if (typeof input !== 'object') return {} as T;
  if (Is.map(input) || Is.proxy(input)) return Immutable.toObject(input) as T;
  return R.clone(input) as unknown as T;
}
