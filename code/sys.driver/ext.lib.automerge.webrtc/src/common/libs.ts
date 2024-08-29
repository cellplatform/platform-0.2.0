/**
 * @external
 */
import { equals, mergeDeepRight as merge } from 'ramda';
export const R = { equals, merge } as const;

export { next as A } from '@automerge/automerge';
export { PeerjsNetworkAdapter } from 'automerge-repo-network-peerjs';

/**
 * @ext
 */
export { Doc, Store, Sync, toObject, WebStore } from 'ext.lib.automerge';

/**
 * @system
 */
export { UserAgent } from 'sys.ui.dom';
export {
  cuid,
  Delete,
  Filesize,
  Hash,
  Immutable,
  Json,
  Log,
  ObjectPath,
  rx,
  Time,
  Value,
} from 'sys.util';
