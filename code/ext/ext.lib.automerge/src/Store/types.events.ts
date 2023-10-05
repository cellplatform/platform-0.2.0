import { type t } from './common';

export type O = Record<string, unknown>;

/**
 * Event API
 */
export type DocEvents<T> = t.Lifecycle & {
  readonly $: t.Observable<t.DocEvent<T>>;
  readonly changed$: t.Observable<t.DocChanged<T>>;
};

/**
 * EVENTS
 */
export type DocEvent<T = O> = DocChangedEvent<T>;
export type DocChangedEvent<T> = {
  readonly type: 'crdt:DocChanged';
  readonly payload: DocChanged<T>;
};
export type DocChanged<T = O> = {
  readonly uri: t.DocUri;
  readonly doc: T;
  readonly patches: t.Patch[];
  readonly patchInfo: t.PatchInfo<T>;
};
