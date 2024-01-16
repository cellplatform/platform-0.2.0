import type { t } from '../common';

/**
 * Retrieves a child descentent from within a {document} object.
 */
export type LensGetDescendent<R extends {}, L extends {}> = (doc: R) => L;

/**
 * Lens for operating on a sub-tree within a CRDT.
 */
export type Lens<R extends {}, L extends {}> = t.Lifecycle & {
  readonly root: t.DocRef<R>;
  readonly current: L;
  change(fn: t.ImmutableNext<L>): t.Lens<R, L>;
  events(dispose$?: t.UntilObservable): LensEvents<R, L>;
  lens<T extends {}>(get: LensGetDescendent<L, T>): Lens<R, T>;
  toObject(): L;
};

/**
 * Events API
 */
export type LensEvents<R extends {}, L extends {}> = t.Lifecycle & {
  readonly $: t.Observable<LensEvent<R, L>>;
  readonly changed$: t.Observable<LensChanged<R, L>>;
};

/**
 * Events
 */
export type LensEvent<R extends {}, L extends {}> = LensChangedEvent<R, L>;

export type LensChangedEvent<R extends {}, L extends {}> = {
  type: 'crdt:lens:changed';
  payload: LensChanged<R, L>;
};
export type LensChanged<R extends {}, L extends {}> = t.DocChanged<R> & { lens: L };
