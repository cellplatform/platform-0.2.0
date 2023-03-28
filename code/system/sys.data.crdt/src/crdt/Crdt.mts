import { PeerSyncer } from '../crdt.DocSync';
import { CrdtDoc as Doc } from '../crdt.Doc';
import { CrdtIs as Is, fieldAs, toObject } from '../crdt.helpers';

/**
 * Main index for the [sys.data.crdt] module.
 */
export const Crdt = {
  Doc,
  Is,
  fieldAs,
  toObject,
};
