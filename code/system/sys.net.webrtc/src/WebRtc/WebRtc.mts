import type { Automerge } from 'sys.data.crdt';
export type { Automerge };

import { WebRtcController as Controller } from '../WebRtc.Controller';
import { WebRtcUtils as Util } from '../WebRtc.Util';
import { peer } from './WebRtc.peer.mjs';
import { Media } from '../WebRtc.Media';
import { WebRtcEvents } from '../WebRtc.Events';
import { NetworkSchema } from '../sys.net.schema';
import { WebRtcState } from '../WebRtc.State';

/**
 * Library for working with WebRTC peer-to-peer connections.
 */
export const WebRtc = {
  peer,
  client: WebRtcEvents.client,
  state: WebRtcState.init,

  NetworkSchema,
  Media,
  Util,

  Controller,
  controller: Controller.listen,
};
