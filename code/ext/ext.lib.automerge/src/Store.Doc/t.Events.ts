import type { t } from './common';

type O = Record<string, unknown>;

/**
 * Event API
 */
export type DocEvents<T> = t.Lifecycle & {
  readonly $: t.Observable<t.DocEvent<T>>;
  readonly changed$: t.Observable<t.DocChanged<T>>;
  readonly ephemeral: {
    readonly in$: t.Observable<t.DocEphemeralIn<T>>;
    readonly out$: t.Observable<t.DocEphemeralOut<T>>;
    type$<M extends t.CBOR>(
      filter?: DocEphemeralFilter<T, M>,
    ): t.Observable<t.DocEphemeralIn<T, M>>;
  };
};

export type DocEphemeralFilter<T, M extends t.CBOR> = (e: t.DocEphemeralIn<T, M>) => boolean;

/**
 * Events
 */
export type DocEvent<T = O> = DocChangedEvent<T> | DocEphemeralEvent<T>;

/**
 * Event: Document change
 */
export type DocChangedEvent<T> = {
  type: 'crdt:doc/Changed';
  payload: DocChanged<T>;
};
export type DocChanged<T = O> = {
  uri: t.DocUri;
  doc: T;
  patches: t.Patch[];
  patchInfo: t.PatchInfo<T>;
};

/**
 * Event: Ephemeral message.
 * https://automerge.org/docs/repositories/ephemeral
 */
export type DocEphemeralEvent<T = O> = DocEphemeralInEvent<T> | DocEphemeralOutEvent<T>;
export type DocEphemeralInEvent<T = O, M extends t.CBOR = t.CBOR> = {
  type: 'crdt:doc/Ephemeral:in';
  payload: DocEphemeralIn<T, M>;
};
export type DocEphemeralIn<T = O, M extends t.CBOR = t.CBOR> = DocEphemeralCommon<T> & {
  direction: 'incoming';
  sender: { id: string };
  message: M;
};

export type DocEphemeralOutEvent<T = O> = {
  type: 'crdt:doc/Ephemeral:out';
  payload: DocEphemeralOut<T>;
};
export type DocEphemeralOut<T = O> = DocEphemeralCommon<T> & {
  direction: 'outgoing';
  data: Uint8Array;
};
type DocEphemeralCommon<T = O> = { doc: t.DocRefHandle<T> };
