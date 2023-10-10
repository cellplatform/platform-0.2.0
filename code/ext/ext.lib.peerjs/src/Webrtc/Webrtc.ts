import { type t } from './common';
import { Peer } from './Peer';
import { PeerUri as Uri } from './PeerUri';

export const Webrtc = {
  Uri,
  Peer,
} as const;
