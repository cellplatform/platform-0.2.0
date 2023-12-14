import type { t } from './common';

type O = Record<string, unknown>;

/**
 * Event API
 */
export type DocEvents<T> = t.Lifecycle & {
  readonly $: t.Observable<t.DocEvent<T>>;
  readonly changed$: t.Observable<t.DocChanged<T>>;
};

/**
 * Events
 */
export type DocEvent<T = O> = DocChangedEvent<T>;

export type DocChangedEvent<T> = {
  readonly type: 'crdt:doc/Changed';
  readonly payload: DocChanged<T>;
};
export type DocChanged<T = O> = {
  readonly uri: t.DocUri;
  readonly doc: T;
  readonly patches: t.Patch[];
  readonly patchInfo: t.PatchInfo<T>;
};

export type DocEphemeralEvent = {
  readonly type: 'crdt:doc/Ephemeral';
};
export type DocEphemeral = {
  direction: t.IODirection;
};
