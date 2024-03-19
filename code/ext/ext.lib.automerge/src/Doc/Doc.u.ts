import { type t } from './common';

/**
 * Convert a DocRef → DocRefHandle.
 */
export function asHandle<T>(doc: t.DocRef<T>) {
  return doc as t.DocRefHandle<T>;
}
