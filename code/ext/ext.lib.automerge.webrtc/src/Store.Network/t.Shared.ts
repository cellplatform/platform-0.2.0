import type { t } from './common';

type O = Record<string, unknown>;

export type CrdtSharedMutateAction = 'unshare';

export type CrdtSharedState = t.Lifecycle & {
  readonly kind: 'crdt.network.shared';
  readonly store: t.Store;
  readonly index: t.StoreIndexState;
  readonly doc: t.DocRef<t.CrdtShared>;

};

/**
 * An ephemeral document for the purposes of synchonizing
 * state and configuration between connected peers.
 */
export type CrdtShared = t.DocWithMeta & {
  sys: { peers: CrdtSharedPeers; docs: CrdtSharedDocs };
  ns: t.NamespaceMap;
  tmp?: O; // TEMP 🐷 ??
};

/**
 * Map of connected peers.
 */
export type CrdtSharedPeers = { [peerid: string]: CrdtSharedPeer };
export type CrdtSharedPeer = { ua: t.UserAgent };

/**
 * Map of shared documents.
 */
export type CrdtSharedDocs = { [uri: string]: CrdtSharedDoc };
export type CrdtSharedDoc = { shared: boolean; version: number };

/**
 * Events
 */
export type CrdtSharedEvent = CrdtSharedReadyEvent | CrdtSharedChangedEvent;

export type CrdtSharedReadyEvent = {
  type: 'crdt:webrtc:shared/Ready';
  payload: CrdtSharedState;
};

export type CrdtSharedChangedEvent = {
  type: 'crdt:webrtc:shared/Changed';
  payload: CrdtSharedChanged;
};
export type CrdtSharedChanged = t.DocChanged<t.CrdtShared>;
