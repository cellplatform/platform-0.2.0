import type { t } from '../common';

type AutomergeLocalChange = Uint8Array;
type Id = string;

/**
 * Document Change Handler.
 */
export type CrdtDocRefChangeHandler<D extends {}> = (e: CrdtDocRefChangeHandlerArgs<D>) => void;
export type CrdtDocRefChangeHandlerArgs<D extends {}> = {
  doc: D;
  change: AutomergeLocalChange;
};

/**
 * Represents an observable handle to a CRDT document.
 */
export type CrdtDocRef<D extends {}> = t.Disposable & {
  readonly kind: 'Crdt:DocRef';
  readonly id: CrdtDocRefId;
  readonly $: t.Observable<CrdtDocAction<D>>;
  readonly current: D;
  readonly disposed: boolean;
  readonly history: CrdtDocHistory<D>[];
  change(fn: CrdtMutator<D>): CrdtDocRef<D>;
  change(message: string, fn: CrdtMutator<D>): CrdtDocRef<D>;
  replace(doc: D): CrdtDocRef<D>;
  onChange(fn: CrdtDocRefChangeHandler<D>): CrdtDocRef<D>;
  toObject(): D;
};

export type CrdtDocRefId = { actor: Id; doc: Id; toString(): string };

export type CrdtDocHistory<D extends {}> = t.AutomergeState<D>;

export type CrdtDocActionKind = CrdtDocAction<{}>['action'];
export type CrdtDocAction<D extends {}> = CrdtDocChange<D> | CrdtDocReplace<D>;
export type CrdtDocChange<D extends {}> = {
  doc: D;
  action: 'change';
  change?: AutomergeLocalChange;
  info: {
    time: number; // Unix timestamp (advisory only, not used in conflict resolution).
    message?: string;
  };
};
export type CrdtDocReplace<D extends {}> = { doc: D; action: 'replace' };

/**
 * A function that mutates a CRDT document.
 */
export type CrdtMutator<D extends {}> = (doc: D) => void;
