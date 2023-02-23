import { t } from '../common.t';

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
export type CrdtDocChange<D extends {}> = { doc: D; action: 'change' };
export type CrdtDocReplace<D extends {}> = { doc: D; action: 'replace' };

/**
 * A function that mutates a CRDT document.
 */
export type CrdtMutator<D extends {}> = (doc: D) => void;

/**
 * A file-system wrapper for a single CRDT document.
 */
export type CrdtDocFile<D extends {}> = t.Disposable & {
  readonly doc: t.CrdtDocRef<D>;
  readonly isAutosaving: boolean;
  readonly isDisposed: boolean;
  exists(): Promise<boolean>;
  info(): Promise<CrdtDocFileInfo>;
  load(): Promise<void>;
  save(): Promise<void>;
};

export type CrdtDocFileInfo = {
  bytes: number;
  exists: boolean;
  manifest: t.DirManifest;
};
