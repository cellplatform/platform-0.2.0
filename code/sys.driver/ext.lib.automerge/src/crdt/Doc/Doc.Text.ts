import { A, type t, ObjectPath } from './common';
import { diff } from './Doc.Text.diff';
import { splice } from './Doc.Text.splice';

type O = Record<string, unknown>;

/**
 * Syncer for a text <input> element.
 */
export const Text = {
  splice,
  diff,

  replace<T extends O>(doc: T, path: t.ObjectPath, next: string) {
    const current = ObjectPath.resolve(doc, path);
    if (typeof current === 'string') splice(doc, path, 0, current.length, next);
  },
} as const;
