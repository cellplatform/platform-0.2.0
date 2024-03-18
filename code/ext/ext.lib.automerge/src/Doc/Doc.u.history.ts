import { A, type t } from './common';

/**
 * Retrieve the history of the given document.
 */
export function history<T>(doc: t.DocRef<T>): t.DocHistory<T> {
  const commits = A.getHistory<T>(doc.current);
  return { commits };
}
