import * as t from '../common/types.mjs';

type Milliseconds = number;
type Id = string;
type SpecId = Id;
type O = Record<string, unknown>;
type IgnoredResponse = any | Promise<any>;

export type DevInstance = { bus: t.EventBus<any>; id: Id };

export type DevInfo = {
  instance: { context: Id };
  root?: t.TestSuiteModel;
  props?: t.SpecRenderProps;
  render: {
    state?: O;
  };
  run: { count: number; results?: t.TestSuiteRunResponse };
};

export type DevInfoMutater = (draft: t.DevInfo) => IgnoredResponse;
export type DevInfoStateMutater<T extends O> = (draft: T) => IgnoredResponse;

export type DevInfoChangeMessage =
  | 'state:write'
  | 'context:init'
  | 'spec:load'
  | 'spec:unload'
  | 'run:all'
  | 'run:subset';

/**
 * EVENT (API)
 */
export type DevEvents = t.Disposable & {
  $: t.Observable<t.DevEvent>;
  instance: { bus: Id; id: Id };
  disposed: boolean;
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
    fire(options?: { only?: SpecId | SpecId[]; timeout?: Milliseconds }): Promise<t.DevRunRes>;
  };
  reset: {
    req$: t.Observable<t.DevResetReq>;
    res$: t.Observable<t.DevResetRes>;
    fire(options?: { timeout?: Milliseconds }): Promise<DevResetRes>;
  };
  state: {
    changed$: t.Observable<t.DevInfoChanged>;
    change: {
      req$: t.Observable<t.DevStateChangeReq>;
      res$: t.Observable<t.DevStateChangeRes>;
      fire<T extends O>(args: {
        mutate: t.DevInfoStateMutater<T>;
        initial: T;
        timeout?: Milliseconds;
      }): Promise<DevStateChangeRes>;
    };
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
  | DevRunResEvent
  | DevResetReqEvent
  | DevResetResEvent
  | DevStateChangeReqEvent
  | DevStateChangeResEvent;

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
export type DevInfoChanged = { instance: Id; info: DevInfo; message: DevInfoChangeMessage };

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
export type DevRunReq = {
  tx: string;
  instance: Id;
  only?: SpecId[];
};

export type DevRunResEvent = { type: 'sys.dev/run:res'; payload: DevRunRes };
export type DevRunRes = { tx: string; instance: Id; info?: t.DevInfo; error?: string };

/**
 * Reset context/state.
 */
export type DevResetReqEvent = { type: 'sys.dev/reset:req'; payload: DevResetReq };
export type DevResetReq = { tx: string; instance: Id };

export type DevResetResEvent = { type: 'sys.dev/reset:res'; payload: DevResetRes };
export type DevResetRes = { tx: string; instance: Id; info?: t.DevInfo; error?: string };

/**
 * State, mutation
 */
export type DevStateChangeReqEvent = {
  type: 'sys.dev/state/change:req';
  payload: DevStateChangeReq;
};
export type DevStateChangeReq = {
  tx: string;
  instance: Id;
  mutate: t.DevInfoStateMutater<any>;
  initial: O;
};

export type DevStateChangeResEvent = {
  type: 'sys.dev/state/change:res';
  payload: DevStateChangeRes;
};
export type DevStateChangeRes = {
  tx: string;
  instance: Id;
  info?: t.DevInfo;
  error?: string;
};
