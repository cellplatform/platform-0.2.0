import type * as t from '../common/t';

type O = Record<string, unknown>;
type Id = string;
type Milliseconds = number;
type KeyPath = string;
type Semver = string;

export type JsonBusInstance = { bus: t.EventBus<any>; id: Id };
export type JsonEventFilter = (e: t.JsonEvent) => boolean;
export type JsonStateChange<T extends O = O> = {
  key: KeyPath;
  op: t.PatchOperationKind;
  value: T;
};
export type JsonMutation<T extends O = O> = (prev: T, ctx: JsonMutationCtx) => any | Promise<any>;
export type JsonMutationCtx = t.PatchMutationCtx;

/**
 * Module Status Info
 */
export type JsonInfo = {
  module: { name: string; version: Semver };
  keys: string[];
};

/**
 * EVENT (API)
 */
export type JsonEvents = t.Disposable & {
  instance: { bus: Id; id: Id };
  $: t.Observable<t.JsonEvent>;
  changed$: t.Observable<t.JsonStateChange>;
  is: { base(input: any): boolean };
  info: JsonEventsInfo;
  state: JsonEventsState;
  json<T extends O = O>(initial: T | (() => T), options?: JsonStateOptions): JsonState<T>;
};

export type JsonEventsInfo = {
  req$: t.Observable<t.JsonInfoReq>;
  res$: t.Observable<t.JsonInfoRes>;
  get(options?: { timeout?: Milliseconds }): Promise<JsonInfoRes>;
};

/**
 * State API.
 */
export type JsonEventsState = {
  get: {
    req$: t.Observable<JsonStateGetReq>;
    res$: t.Observable<JsonStateGetRes>;
    fire<T extends O = O>(options?: {
      tx?: Id;
      timeout?: Milliseconds;
      key?: KeyPath;
      initial?: T | (() => T);
    }): Promise<JsonStateGetRes<T>>;
  };
  put: {
    req$: t.Observable<JsonStatePutReq>;
    res$: t.Observable<JsonStatePutRes>;
    fire<T extends O = O>(
      value: T,
      options?: { tx?: Id; timeout?: Milliseconds; key?: KeyPath },
    ): Promise<JsonStatePutRes>;
  };
  patch: {
    req$: t.Observable<JsonStatePatchReq>;
    res$: t.Observable<JsonStatePatchRes>;
    fire<T extends O = O>(
      fn: JsonMutation<T>,
      options?: { tx?: Id; timeout?: Milliseconds; key?: KeyPath; initial?: T | (() => T) },
    ): Promise<JsonStatePatchRes>;
  };
};

/**
 * JSON (a key-pathed API into a document).
 */
export type JsonStateOptions = { key?: KeyPath; timeout?: Milliseconds };
export type JsonState<T extends O = O> = {
  readonly $: t.Observable<t.JsonStateChange<T>>;
  readonly current: T;
  get(options?: { timeout?: Milliseconds }): Promise<JsonStateGetRes<T>>;
  put(value: T, options?: { timeout?: Milliseconds }): Promise<JsonStatePutRes>;
  patch(fn: JsonMutation<T>, options?: { timeout?: Milliseconds }): Promise<JsonStatePatchRes>;
  lens<L extends O = O>(target: (root: T) => L): JsonLens<L>;
};

export type JsonLens<L extends O = O> = {
  readonly $: t.Observable<L>;
  readonly current: L;
  patch(fn: JsonMutation<L>, options?: { timeout?: Milliseconds }): Promise<void>;
};

/**
 * EVENT (DEFINITIONS)
 */
export type JsonEvent =
  | JsonInfoReqEvent
  | JsonInfoResEvent
  | JsonStateGetReqEvent
  | JsonStateGetResEvent
  | JsonStatePutReqEvent
  | JsonStatePutResEvent
  | JsonStatePatchReqEvent
  | JsonStatePatchResEvent
  | JsonStateChangedEvent;

/**
 * Module info.
 */
export type JsonInfoReqEvent = {
  type: 'sys.json/info:req';
  payload: JsonInfoReq;
};
export type JsonInfoReq = { tx: string; instance: Id };

export type JsonInfoResEvent = {
  type: 'sys.json/info:res';
  payload: JsonInfoRes;
};
export type JsonInfoRes = {
  tx: string;
  instance: Id;
  info?: JsonInfo;
  error?: string;
};

/**
 * Retrieve the current state.
 */
export type JsonStateGetReqEvent = {
  type: 'sys.json/state.get:req';
  payload: JsonStateGetReq;
};
export type JsonStateGetReq = { instance: Id; tx: Id; key: string };

export type JsonStateGetResEvent<T extends O = O> = {
  type: 'sys.json/state.get:res';
  payload: JsonStateGetRes<T>;
};
export type JsonStateGetRes<T extends O = O> = {
  instance: Id;
  tx: Id;
  key: KeyPath;
  value?: T;
  error?: string;
};

/**
 * PUT: update/overwrite the current state.
 */
export type JsonStatePutReqEvent<T extends O = O> = {
  type: 'sys.json/state.put:req';
  payload: JsonStatePutReq<T>;
};
export type JsonStatePutReq<T extends O = O> = { instance: Id; tx: Id; key: KeyPath; value: T };

export type JsonStatePutResEvent = {
  type: 'sys.json/state.put:res';
  payload: JsonStatePutRes;
};
export type JsonStatePutRes = { instance: Id; tx: Id; key: KeyPath; error?: string };

/**
 * PATCH: update/overwrite the current state.
 */
export type JsonStatePatchReqEvent = {
  type: 'sys.json/state.patch:req';
  payload: JsonStatePatchReq;
};
export type JsonStatePatchReq = {
  instance: Id;
  tx: Id;
  key: KeyPath;
  op: t.PatchOperationKind;
  patches: t.PatchSet;
};

export type JsonStatePatchResEvent = {
  type: 'sys.json/state.patch:res';
  payload: JsonStatePatchRes;
};
export type JsonStatePatchRes = {
  instance: Id;
  tx: Id;
  key: KeyPath;
  error?: string;
};

/**
 * Fired when the state changes.
 */
export type JsonStateChangedEvent = {
  type: 'sys.json/state:changed';
  payload: JsonStateChanged;
};
export type JsonStateChanged = {
  instance: Id;
  change: JsonStateChange;
};
