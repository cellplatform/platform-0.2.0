import type { Automerge } from 'sys.data.crdt';
export type { Automerge };

import { WebRtcController as Controller } from '../WebRtc.Controller';
import { WebRtcUtils as Util } from '../WebRtc.Util';
import { peer } from './WebRtc.peer.mjs';
import { Media } from '../WebRtc.Media';
import { events } from '../WebRtc.Events';
import { WebRtcInfo as InfoCard } from '../ui/ui.Info';
import { NetworkSchema } from '../sys.net.schema';

/**
 * Library for working with WebRTC peer-to-peer connections.
 */
export const WebRtc = {
  peer,
  events,
  InfoCard,
  Controller,
  NetworkSchema,
  Media,
  Util,
};
