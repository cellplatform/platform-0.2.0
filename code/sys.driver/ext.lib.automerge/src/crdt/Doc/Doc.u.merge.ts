import { type t } from './common';
import { toHandle } from './u.Handle';

type O = Record<string, unknown>;

/**
 * Helper for merging one document into another.
 */
export function merge<T extends O>(source: t.Doc<T>, target: t.Doc<T>) {
  toHandle(target).merge(toHandle(source));
}
