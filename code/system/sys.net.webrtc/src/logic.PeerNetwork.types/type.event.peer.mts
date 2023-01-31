import type { t } from '../common.t';

export type PeerEvent =
  | t.PeerLocalEvent
  | t.PeerConnectionEvent
  | t.PeerDataEvent
  | t.PeerRemoteEvent;
