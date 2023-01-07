import { t } from './common';

export type PeerEvent =
  | t.PeerLocalEvent
  | t.PeerConnectionEvent
  | t.PeerDataEvent
  | t.PeerRemoteEvent;
