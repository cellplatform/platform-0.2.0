import type { Automerge } from 'sys.data.crdt';
export type { Automerge };

import { WebRtcController as Controller } from '../WebRtc.Controller';
import { WebRtcUtils as Util } from '../WebRtc.Util';
import { peer } from './WebRtc.peer.mjs';
import { Media } from '../WebRtc.Media';
import { events } from '../WebRtc.Events';

/**
 * Library for working with WebRTC peer-to-peer connections.
 */
export const WebRtc = {
  Controller,
  Media,
  Util,
  peer,
  events,
};
