import { R, t, Automerge } from './common';
import { CrdtIs as Is } from './Crdt.Is.mjs';

/**
 * Convert a CRDT document into a plain object.
 */
export function toObject<D extends {}>(doc: D | t.CrdtDocRef<D>) {
  const obj = (doc: {}) => R.clone(doc);
  if (Automerge.isAutomerge(doc)) return obj(doc as D);
  if (Is.ref(doc)) return obj(doc.current);
  if (Is.file(doc)) return obj(doc.doc.current);
  if (Is.sync(doc)) return obj(doc.doc.current);
  if (typeof doc === 'object' && doc !== null && !Array.isArray(doc)) return doc;
  throw new Error(`Unable to convert ${typeof doc} into object.`);
}
