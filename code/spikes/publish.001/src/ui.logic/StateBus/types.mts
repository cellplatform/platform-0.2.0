import * as t from '../common/types.mjs';

type Id = string;
type Milliseconds = number;
type Semver = string;
type UrlString = string;

export type StateInstance = { bus: t.EventBus<any>; id?: Id };
export type StateFetchTarget = 'Outline';

export type StateInfo = {
  module: { name: string; version: Semver };
  current: t.StateTree;
};

/**
 * EVENT (API)
 */
export type StateEvents = t.Disposable & {
  $: t.Observable<t.StateEvent>;
  instance: { bus: Id; id: Id };
  is: { base(input: any): boolean };
  init(): Promise<void>;
  info: {
    req$: t.Observable<t.StateInfoReq>;
    res$: t.Observable<t.StateInfoRes>;
    get(options?: { timeout?: Milliseconds }): Promise<StateInfoRes>;
  };
  fetch: {
    req$: t.Observable<t.StateFetchReq>;
    res$: t.Observable<t.StateFetchRes>;
    outline(options?: {
      timeout?: Milliseconds;
      target?: StateFetchTarget[];
    }): Promise<StateFetchRes>;
  };
  changed: {
    $: t.Observable<t.StateChanged>;
    fire(): Promise<void>;
  };
  select: {
    $: t.Observable<t.StateSelect>;
    fire(selected?: UrlString): Promise<void>;
  };
};

/**
 * EVENT (DEFINITIONS)
 */
export type StateEvent =
  | StateReqEvent
  | StateResEvent
  | StateFetchReqEvent
  | StateFetchResEvent
  | StateChangedEvent
  | StateSelectEvent;

/**
 * Module info.
 */
export type StateReqEvent = {
  type: 'app.state/info:req';
  payload: StateInfoReq;
};
export type StateInfoReq = { tx: string; instance: Id };

export type StateResEvent = {
  type: 'app.state/info:res';
  payload: StateInfoRes;
};
export type StateInfoRes = {
  tx: string;
  instance: Id;
  info?: StateInfo;
  error?: string;
};

/**
 * Fetch Data
 */
export type StateFetchReqEvent = {
  type: 'app.state/fetch:req';
  payload: StateFetchReq;
};
export type StateFetchReq = {
  tx: string;
  instance: Id;
  target?: StateFetchTarget[];
};

export type StateFetchResEvent = {
  type: 'app.state/fetch:res';
  payload: StateFetchRes;
};
export type StateFetchRes = {
  tx: string;
  instance: Id;
  current: t.StateTree;
  error?: string;
};

/**
 * State Changed
 */
export type StateChangedEvent = {
  type: 'app.state/changed';
  payload: StateChanged;
};
export type StateChanged = { instance: Id; current: t.StateTree };

/**
 * Change selection
 */
export type StateSelectEvent = {
  type: 'app.state/select';
  payload: StateSelect;
};
export type StateSelect = { instance: Id; selected?: UrlString };
