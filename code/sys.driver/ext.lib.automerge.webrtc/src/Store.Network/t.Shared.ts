import type { t } from './common';

export type CrdtSharedMutateAction = 'unshare';

export type CrdtSharedState = t.Lifecycle & {
  readonly kind: 'crdt.network.shared';
  readonly doc: t.Doc<t.CrdtShared>;
  readonly ns: t.NamespaceManager<string>;
  events(dispose$?: t.UntilObservable): t.CrdtSharedEvents;
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
