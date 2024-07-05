import { A, ObjectPath, type t } from './common';

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

/**
 * Replace part of a string using splice.
 */
export function replace<T extends O>(doc: T, path: t.ObjectPath, next: string) {
  const current = ObjectPath.resolve(doc, path);
  if (typeof current === 'string') splice(doc, path, 0, current.length, next);
}
