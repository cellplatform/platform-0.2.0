import type { t } from '../common.t';

type AutomergeLocalChange = Uint8Array;

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
  readonly id: { actor: string };
  readonly $: t.Observable<CrdtDocAction<D>>;
  readonly current: D;
  readonly isDisposed: boolean;
  change(fn: CrdtMutator<D>): void;
  replace(doc: D): void;
};

export type CrdtDocActionKind = CrdtDocAction<{}>['action'];
export type CrdtDocAction<D extends {}> = CrdtDocChange<D> | CrdtDocReplace<D>;
export type CrdtDocChange<D extends {}> = {
  doc: D;
  action: 'change';
  change?: AutomergeLocalChange;
};
export type CrdtDocReplace<D extends {}> = { doc: D; action: 'replace' };

/**
 * A function that mutates a CRDT document.
 */
export type CrdtMutator<D extends {}> = (doc: D) => void;
