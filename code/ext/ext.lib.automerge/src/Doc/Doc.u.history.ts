import { A, type t } from './common';

/**
 * Retrieve the history of the given document.
 */
export function history<T>(doc: t.DocRef<T>): t.DocHistory<T> {
  return A.getHistory<T>(doc.current);
}
