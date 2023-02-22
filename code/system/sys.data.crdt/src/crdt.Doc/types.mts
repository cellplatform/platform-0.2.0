import { t } from '../common.t';

export type CrdtDocAction = 'change' | 'replace';

/**
 * Represents an observable handle to a CRDT document.
 */
export type CrdtDocRef<D extends {}> = {
  readonly id: { actor: string };
  readonly $: t.Observable<CrdtDocChange<D>>;
  readonly current: D;
  change(fn: CrdtMutator<D>): void;
  replace(doc: D): void;
};

export type CrdtDocChange<D extends {}> = { doc: D; action: CrdtDocAction };

/**
 * A function that mutates a CRDT document.
 */
export type CrdtMutator<D extends {}> = (doc: D) => void;

/**
 * A file-system wrapper for a single CRDT document.
 */
export type CrdtDocFile<D extends {}> = {
  readonly doc: t.CrdtDocRef<D>;
  exists(): Promise<boolean>;
  load(): Promise<void>;
  save(): Promise<void>;
};
