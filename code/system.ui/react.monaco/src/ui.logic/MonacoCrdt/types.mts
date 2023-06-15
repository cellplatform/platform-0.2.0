import type { t } from '../../common.t';

type PeerId = string;

/**
 * An adapter for managing 2-way binding between a Monaco code-editor
 * and a CRDT (Automerge.Text) collaborative text data-structure.
 */
export type MonacoCrdtSyncer = t.Disposable & {
  readonly kind: 'crdt:monaco:syncer';
  readonly disposed: boolean;
  readonly $: t.Observable<MonacoCrdtSyncerChange>;
};

export type MonacoCrdtSyncerChange = {
  kind: 'text' | 'selection' | 'focus';
  proximity: 'local' | 'remote';
};

export type MonacoCrdtSyncerDocTextArg<D extends {}> = {
  doc: t.CrdtDocRef<D>;
  getText: (doc: D) => t.AutomergeText;
};

export type MonacoCrdtSyncerDocPeersArg<D extends {}> = {
  local: PeerId;
  doc: t.CrdtDocRef<D>;
  getPeers: (doc: D) => t.EditorPeersState;
};

/**
 * A data-structure for tracking the transient editor-state of syncing each peer.
 * NOTE:
 *    This transient data-structure may be on the same CRDT document that contains
 *    the data, however is more likely to be a different document setup purely
 *    for the purposes of manging connected peer state.
 */
export type EditorPeersState = { [peerId: string]: EditorPeerState };
export type EditorPeerState = {
  selections?: t.EditorRange[];
  textFocused?: boolean;
};
