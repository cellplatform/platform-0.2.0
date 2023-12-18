import { type t } from './common';

import { WebrtcIs as Is } from './Is';
import { PeerUri } from './Peer.Uri';
import { PeerJs } from '../Webrtc.PeerJs/PeerJs';
import { PeerModel } from '../Webrtc.Peer';

export const Webrtc: t.Webrtc = {
  Is,
  PeerJs,
  PeerUri,
  PeerModel,
  peer: PeerModel.init,
} as const;
