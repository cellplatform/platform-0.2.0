import { A, type t } from './common';

type O = Record<string, unknown>;
type Cursor = string;

/**
 * Safely modify a string stored on a CRDT.
 */
export function splice<T extends O>(
  doc: T,
  path: t.ObjectPath,
  index: t.Index | Cursor,
  del: number,
  newText?: string,
) {
  A.splice(doc, [...path], index, del, newText);
}
