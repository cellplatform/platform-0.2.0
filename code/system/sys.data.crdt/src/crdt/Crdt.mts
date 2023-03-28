import { CrdtDoc as Doc } from '../crdt.Doc';
import { CrdtIs as Is, CrdtText as Text, fieldAs, toObject } from '../crdt.helpers';

/**
 * Main index for the [sys.data.crdt] module.
 */
export const Crdt = {
  Doc,
  Is,
  Text,
  fieldAs,
  toObject,
};
