import { R, t, Automerge } from './common';
import { CrdtIs as Is } from './Crdt.IsFlags.mjs';

/**
 * (implementation) Convert a CRDT document into a plain object.
 */
function convert<D extends {}>(doc: D | t.CrdtDocRef<D>): D {
  const obj = (doc: {}) => R.clone(doc) as D;
  if (Automerge.isAutomerge(doc)) return obj(doc as D);
  if (Is.ref(doc)) return obj(doc.current);
  if (Is.file(doc)) return obj(doc.doc.current);
  if (Is.sync(doc)) return obj(doc.doc.current);
  if (Is.lens(doc)) return obj(doc.current);
  if (typeof doc === 'object' && doc !== null && !Array.isArray(doc)) return obj(doc);
  throw new Error(`Unable to convert ${typeof doc} into object.`);
}

/**
 * Convert a CRDT document into a plain object.
 */
export const toObject: t.CrdtAsObject = convert;
