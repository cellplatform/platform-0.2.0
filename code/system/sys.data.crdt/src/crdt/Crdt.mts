import { PeerSyncer } from '../crdt.DocSync';
import { CrdtDoc as Doc } from '../crdt.Doc';
import { CrdtIs as is, fieldAs, toObject } from '../crdt.helpers';
const Schema = Doc.Schema;

/**
 * Main index for the [sys.data.crdt] module.
 */
export const Crdt = {
  Schema,
  Doc,
  is,
  fieldAs,
  toObject,

  PeerSyncer, // TODO 🐷 remove this now [internal only]
};
