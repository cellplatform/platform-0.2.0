import type { t } from '../common.t';

type Id = string;
type Milliseconds = number;

export type CrdtDocSyncOptions<D extends {}> = {
  dispose$?: t.Observable<any>;
  onChange?: t.CrdtDocRefChangeHandler<D>;
  debounce?: Milliseconds;
  syncOnStart?: boolean;
  filedir?: t.Fs;
};

/**
 * Extends a CRDT [DocRef] with peer-sync capabilities.
 */
export type CrdtDocSync<D extends {}> = {
  readonly kind: 'Crdt:DocSync';
  readonly count: number;
  readonly doc: t.CrdtDocRef<D>;
  readonly disposed: boolean;
  readonly dispose$: t.Observable<any>;
  dispose(): Promise<void>;
  update: PeerSyncer['update'];
};

/**
 * Wraps the network synchronization logic for single CRDT
 * document and a set of network peers.
 */
export type PeerSyncer = {
  readonly count: number;
  state(): Promise<t.AutomergeSyncState>;
  update(): Promise<{ tx: Id; complete: boolean }>;
  dispose(): Promise<void>;
};
