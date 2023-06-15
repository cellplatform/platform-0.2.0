import { CrdtDoc as Doc } from '../crdt.Doc';
import { CrdtIs as Is, CrdtText as Text, fieldAs, toObject } from '../crdt.helpers';
import { CrdtLens as Lens } from '../crdt.Lens';
import { CrdtRepo as Repo } from '../crdt.Repo';

/**
 * Main index for the [sys.data.crdt] module.
 */
export const Crdt = {
  Doc,
  Lens,
  Repo,
  Is,
  Text,

  ref: Doc.ref,
  file: Doc.file,
  sync: Doc.sync,
  lens: Lens.init,
  repo: Repo.init,

  fieldAs,
  toObject,
  text: Text.init,
} as const;
