import { type t } from './common';
import { Peer } from './Peer';
import { PeerUri } from './PeerUri';

export const Webrtc: t.Webrtc = {
  Peer,
  PeerUri,
} as const;
