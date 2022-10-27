import * as t from '../common/types.mjs';

type Id = string;
type Milliseconds = number;
type Semver = string;

export type StateInfo = {
  module: { name: string; version: Semver };
};

/**
 * EVENT (API)
 */
export type StateEvents = t.Disposable & {
  $: t.Observable<t.StateEvent>;
  instance: { bus: Id; id: Id };
  is: { base(input: any): boolean };
  info: {
    req$: t.Observable<t.MyInfoReq>;
    res$: t.Observable<t.MyInfoRes>;
    get(options?: { timeout?: Milliseconds }): Promise<MyInfoRes>;
  };
};

/**
 * EVENT (DEFINITIONS)
 */
export type StateEvent = StateReqEvent | StateResEvent;

/**
 * Module info.
 */
export type StateReqEvent = {
  type: 'app.state/info:req';
  payload: MyInfoReq;
};
export type MyInfoReq = { tx: string; instance: Id };

export type StateResEvent = {
  type: 'app.state/info:res';
  payload: MyInfoRes;
};
export type MyInfoRes = {
  tx: string;
  instance: Id;
  info?: StateInfo;
  error?: string;
};
