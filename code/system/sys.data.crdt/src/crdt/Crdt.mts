import { PeerSyncer } from '../crdt.DocSync';
import { CrdtDoc as Doc } from '../crdt.Doc';
import { CrdtIs as Is, fieldAs, toObject } from '../crdt.helpers';

const Schema = Doc.Schema;

/**
 * Main index for the [sys.data.crdt] module.
 */
export const Crdt = {
  Schema,
  Doc,
  Is,
  fieldAs,
  toObject,

  PeerSyncer, // TODO 🐷 remove this now [internal only]
};
