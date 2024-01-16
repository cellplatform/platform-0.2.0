import type { t } from './common';
import type { Shared } from './Shared';

type O = Record<string, unknown>;

export type CrdtSharedState = Awaited<ReturnType<typeof Shared.init>>;
export type CrdtSharedMutateAction = 'unshare';

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
 * Events.
 */
export type CrdtSharedChangedEvent = {
  type: 'crdt:shared/Changed';
  payload: CrdtSharedChanged;
};
export type CrdtSharedChanged = { change: t.DocChanged<t.CrdtShared> };
