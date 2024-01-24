import type { t } from '../common.t';

export type WebRtcState<N extends string = string> = {
  readonly kind: 'WebRtc:State';
  readonly doc: t.NetworkDocSharedRef;
  readonly current: t.NetworkDocShared;
  readonly props: t.CrdtNsManager<t.NetworkDocShared, N>;
  peer(
    self: t.PeerId,
    subject: t.PeerId,
    options?: { initiatedBy?: t.PeerId; tx?: string },
  ): t.WebRtcPeerLens;
};

/**
 * Lens for operating on a namespaced sub-tree
 * within the shared network {props}.
 */
export type WebRtcPropsLens<T extends {}> = t.CrdtLens<t.NetworkDocShared, T>;

/**
 * Lens for operating on an individual peer
 * within the shared network {peers}.
 */
export type WebRtcPeerLens = t.CrdtLens<t.NetworkDocShared, t.NetworkStatePeer>;
