import { WebRtc } from '../WebRtc';
import { type t } from './common';

export const Wrangle = {
  getStream(options: { getStream?: t.PeerGetMediaStream | boolean } = {}) {
    const { getStream = true } = options;
    if (getStream === true) return WebRtc.Media.singleton({}).getStream;
    if (typeof getStream === 'function') return getStream;
    return undefined;
  },
};
