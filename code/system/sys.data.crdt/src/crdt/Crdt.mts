import { PeerSyncer } from '../crdt.Sync';
import { CrdtDoc as Doc } from '../crdt.Doc';
import { CrdtIs as is, fieldAs } from '../crdt.helpers';

/**
 * Main index for the [sys.data.crdt] module.
 */
export const Crdt = {
  Doc,
  is,
  fieldAs,

  PeerSyncer, // TODO 🐷 remove this now [internal only]
};
