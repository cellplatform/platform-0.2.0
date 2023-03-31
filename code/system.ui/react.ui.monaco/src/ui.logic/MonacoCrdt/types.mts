import type { t } from '../../common.t';
import type { ISelection } from 'monaco-editor';

/**
 * An adapter for managing 2-way binding between a Monaco code-editor
 * and a CRDT (Automerge.Text) collaborative text data-structure.
 */
export type MonacoCrdtSyncer = t.Disposable & {
  readonly kind: 'crdt:monaco:syncer';
  readonly disposed: boolean;
};

/**
 * A data-structure for tracking the transient editor-state of syncing each peer.
 * NOTE:
 *    This transient data-structure may be on the same CRDT document that contains
 *    the data, however is more likely to be a different document setup purely
 *    for the purposes of manging connected peer state.
 */
export type EditorPeersState = { [peerId: string]: EditorPeerState };
export type EditorPeerState = { selection?: ISelection };
