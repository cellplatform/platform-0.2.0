import * as t from '../common/types.mjs';

type Id = string;
type Milliseconds = number;

export type DevInstance = { bus: t.EventBus<any>; id: Id };

export type DevInfo = {
  root?: t.TestSuiteModel;
  run: { results?: t.TestSuiteRunResponse; count: number };
};

export type DevStateMutateHandler = (draft: t.DevInfo) => any | Promise<any>;

/**
 * EVENT (API)
 */
export type DevEvents = t.Disposable & {
  $: t.Observable<t.DevEvent>;
  instance: { bus: Id; id: Id };
  is: { base(input: any): boolean };
  info: {
    req$: t.Observable<t.DevInfoReq>;
    res$: t.Observable<t.DevInfoRes>;
    changed$: t.Observable<t.DevInfoChanged>;
    fire(options?: { timeout?: Milliseconds }): Promise<DevInfoRes>;
    get(options?: { timeout?: Milliseconds }): Promise<DevInfo>;
  };
  load: {
    req$: t.Observable<t.DevLoadReq>;
    res$: t.Observable<t.DevLoadRes>;
    fire(bundle?: t.BundleImport, options?: { timeout?: Milliseconds }): Promise<t.DevLoadRes>;
  };
  unload: {
    fire(options?: { timeout?: Milliseconds }): Promise<t.DevLoadRes>;
  };
  run: {
    req$: t.Observable<t.DevRunReq>;
    res$: t.Observable<t.DevRunRes>;
    fire(options?: { timeout?: Milliseconds }): Promise<t.DevRunRes>;
  };
};

/**
 * EVENT (DEFINITIONS)
 */
export type DevEvent =
  | DevInfoReqEvent
  | DevInfoResEvent
  | DevInfoChangedEvent
  | DevLoadReqEvent
  | DevLoadResEvent
  | DevRunReqEvent
  | DevRunResEvent;

/**
 * Module info.
 */
export type DevInfoReqEvent = {
  type: 'sys.dev/info:req';
  payload: DevInfoReq;
};
export type DevInfoReq = { tx: string; instance: Id };

export type DevInfoResEvent = {
  type: 'sys.dev/info:res';
  payload: DevInfoRes;
};
export type DevInfoRes = { tx: string; instance: Id; info?: DevInfo; error?: string };

export type DevInfoChangedEvent = {
  type: 'sys.dev/info:changed';
  payload: DevInfoChanged;
};
export type DevInfoChanged = { instance: Id; info: DevInfo; message: string };

/**
 * Initialize (with Spec)
 */
export type DevLoadReqEvent = {
  type: 'sys.dev/load:req';
  payload: DevLoadReq;
};
export type DevLoadReq = { tx: string; instance: Id; bundle?: t.BundleImport };

export type DevLoadResEvent = {
  type: 'sys.dev/load:res';
  payload: DevLoadRes;
};
export type DevLoadRes = { tx: string; instance: Id; info?: t.DevInfo; error?: string };

/**
 * Run the suite of tests.
 */
export type DevRunReqEvent = { type: 'sys.dev/run:req'; payload: DevRunReq };
export type DevRunReq = { tx: string; instance: Id };

export type DevRunResEvent = { type: 'sys.dev/run:res'; payload: DevRunRes };
export type DevRunRes = { tx: string; instance: Id; info?: t.DevInfo; error?: string };
