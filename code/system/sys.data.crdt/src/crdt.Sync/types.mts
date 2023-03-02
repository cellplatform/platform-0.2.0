import type { t } from '../common.t';

/**
 * Extends a CRDT [DocRef] with sync capabilities.
 */
export type CrdtDocSync<D extends {}> = t.Disposable & {
  readonly doc: t.CrdtDocRef<D>;
  readonly isDisposed: boolean;
};
