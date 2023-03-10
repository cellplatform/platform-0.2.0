import type { Automerge } from 'sys.data.crdt';
export type { Automerge };

import { Util } from '../WebRTC.Util';
import { peer } from './WebRTC.peer.mjs';
import { Media } from './Media.mjs';

/**
 * Library for working with WebRTC peer-to-peer connections.
 */
export const WebRTC = {
  Util,
  Media,
  peer,
};
