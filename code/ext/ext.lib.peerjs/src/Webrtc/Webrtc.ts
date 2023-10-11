import { type t } from './common';
import { Peer } from './Peer';
import { PeerUri } from './Peer.Uri';
import { Is } from './Is';

export const Webrtc: t.Webrtc = {
  Is,
  Peer,
  PeerUri,
} as const;
