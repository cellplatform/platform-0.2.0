import { type t } from './common';

import { Is } from './Is';
import { PeerUri } from './Peer.Uri';
import { PeerJs } from './PeerJs';

export const Webrtc: t.Webrtc = {
  Is,
  PeerJs,
  PeerUri,
} as const;
