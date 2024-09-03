import { R, Immutable } from './libs';

type O = Record<string, unknown>;

/**
 * Convert the given input to a simple object (deep).
 */
export function toObject<T extends O>(input: T): T {
  if (input === null) return {} as T;
  if (typeof input !== 'object') return {} as T;
  if (Immutable.Is.map(input) || Immutable.Is.proxy(input)) return Immutable.toObject<T>(input);
  return R.clone(input) as unknown as T;
}
