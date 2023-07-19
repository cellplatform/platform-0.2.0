import { CrdtDoc as Doc } from './crdt.Doc';
import { CrdtIs as Is, CrdtText as Text, fieldAs, toObject } from './helpers';
import { CrdtLens as Lens } from './crdt.Lens';
import { CrdtRepo as Repo } from './crdt.Repo';
import { CrdtFunc as Func } from './crdt.Func';

/**
 * Main index for the [sys.data.crdt] module.
 */
export const Crdt = {
  Doc,
  Repo,
  Lens,
  Func,

  Is,
  Text,

  ref: Doc.ref,
  file: Doc.file,
  sync: Doc.sync,
  lens: Lens.init,
  repo: Repo.init,
  func: Func.init,
  namespace: Lens.namespace,

  fieldAs,
  toObject,
  text: Text.init,
} as const;
