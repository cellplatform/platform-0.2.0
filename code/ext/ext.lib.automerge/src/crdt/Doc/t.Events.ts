import type { t } from './common';

type O = Record<string, unknown>;

/**
 * Event API
 */
export type DocEvents<T extends O> = t.Lifecycle & {
  readonly $: t.Observable<t.DocEvent<T>>;
  readonly changed$: t.Observable<t.DocChanged<T>>;
  readonly deleted$: t.Observable<t.DocDeleted<T>>;
  readonly ephemeral: DocEventsEphemeral<T>;
};
export type DocEventsEphemeral<T extends O> = {
  readonly in$: t.Observable<t.DocEphemeralIn<T>>;
  readonly out$: t.Observable<t.DocEphemeralOut<T>>;
  type$<M extends t.CBOR>(filter?: DocEphemeralFilter<T, M>): t.Observable<t.DocEphemeralIn<T, M>>;
};

export type DocEphemeralFilter<T extends O, M extends t.CBOR> = (
  e: t.DocEphemeralIn<T, M>,
) => boolean;

/**
 * Events
 */
export type DocEvent<T extends O = O> =
  | DocChangedEvent<T>
  | DocDeletedEvent<T>
  | DocEphemeralEvent<T>;

/**
 * Event: Document change.
 */
export type DocChangedEvent<T extends O> = {
  type: 'crdt:doc/Changed';
  payload: DocChanged<T>;
};

export type DocChanged<L extends O = O> = {
  uri: t.DocUri;
  before: L;
  after: L;
  patches: t.Patch[];
  source: t.PatchSource;
};

/**
 * Event: Document deleted.
 */
export type DocDeletedEvent<T extends O = O> = {
  type: 'crdt:doc/Deleted';
  payload: DocDeleted<T>;
};
export type DocDeleted<T extends O = O> = {
  uri: t.DocUri;
  doc: T;
};

/**
 * Event: Ephemeral message.
 * https://automerge.org/docs/repositories/ephemeral
 */
export type DocEphemeralEvent<T extends O = O> = DocEphemeralInEvent<T> | DocEphemeralOutEvent<T>;
export type DocEphemeralInEvent<T extends O = O, M extends t.CBOR = t.CBOR> = {
  type: 'crdt:doc/Ephemeral:in';
  payload: DocEphemeralIn<T, M>;
};
export type DocEphemeralIn<T extends O = O, M extends t.CBOR = t.CBOR> = EphemeralCommon<T> & {
  direction: 'incoming';
  sender: { id: string };
  message: M;
};

export type DocEphemeralOutEvent<T extends O = O> = {
  type: 'crdt:doc/Ephemeral:out';
  payload: DocEphemeralOut<T>;
};
export type DocEphemeralOut<T extends O = O> = EphemeralCommon<T> & {
  direction: 'outgoing';
  data: Uint8Array;
};
type EphemeralCommon<T extends O = O> = { doc: t.DocRefHandle<T> };
