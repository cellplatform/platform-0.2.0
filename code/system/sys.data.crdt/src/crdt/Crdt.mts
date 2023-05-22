import { CrdtDoc as Doc } from '../crdt.Doc';
import { CrdtIs as Is, CrdtText as Text, fieldAs, toObject } from '../crdt.helpers';
import { CrdtLens as Lens } from '../crdt.Lens';

/**
 * Main index for the [sys.data.crdt] module.
 */
export const Crdt = {
  Doc,
  Lens,
  Is,
  Text,

  ref: Doc.ref,
  file: Doc.file,
  sync: Doc.sync,
  lens: Lens.init,

  fieldAs,
  toObject,
  text: Text.init,
};
