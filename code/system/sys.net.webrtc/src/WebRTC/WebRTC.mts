import type { Automerge } from 'sys.data.crdt';
export type { Automerge };

import { WebRTCUtil as Util } from '../WebRTC.Util';
import { peer } from './WebRTC.peer.mjs';
import { Media } from '../WebRTC.Media';

/**
 * Library for working with WebRTC peer-to-peer connections.
 */
export const WebRTC = {
  Media,
  Util,
  peer,
};
