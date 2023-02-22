import { PeerSyncer } from '../crdt.Sync';
import { CrdtDoc as Doc } from '../crdt.Doc';
import { CrdtIs as Is } from '../crdt.Is';

/**
 * Main index for the [sys.data.crdt] module.
 */
export const Crdt = {
  Is,
  Doc,
  PeerSyncer,
};
