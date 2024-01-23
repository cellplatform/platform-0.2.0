import type { t } from './common';

type O = Record<string, unknown>;

export type CrdtSharedMutateAction = 'unshare';

export type CrdtSharedState = t.Lifecycle & {
  readonly kind: 'crdt.network.shared';
  readonly store: t.Store;
  readonly index: t.StoreIndexState;
  readonly doc: t.DocRef<t.CrdtShared>;
  events(dispose$?: t.UntilObservable): t.CrdtSharedEvents;
  namespace<N extends string = string>(): t.NamespaceManager<N>;
};

/**
 * An ephemeral document for the purposes of synchonizing
 * state and configuration between connected peers.
 */
export type CrdtShared = t.DocWithMeta & {
  sys: { peers: CrdtSharedPeers; docs: CrdtSharedDocs };
  ns: t.NamespaceMap;
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
