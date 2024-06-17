import { type t } from './common';

import { PeerIs as Is } from './Peer.Is';
import { PeerUri } from './Peer.Uri';
import { PeerJs } from '../Webrtc.PeerJs/PeerJs';
import { Peer } from '../Webrtc.Peer';

export const Webrtc: t.Webrtc = {
  Is,
  PeerJs,
  PeerUri,
  Peer,
  peer: Peer.init,
} as const;
