import type * as t from '../common/types.mjs';

type Id = string;
type Milliseconds = number;
type Semver = string;

export type MyInfo = {
  module: { name: string; version: Semver };
};

export type MyStateMutateHandler = (draft: t.MyInfo) => any | Promise<any>;

/**
 * EVENT (API)
 */
export type MyEvents = t.Disposable & {
  $: t.Observable<t.MyEvent>;
  instance: { bus: Id; id: Id };
  is: { base(input: any): boolean };
  info: {
    req$: t.Observable<t.MyInfoReq>;
    res$: t.Observable<t.MyInfoRes>;
    fire(options?: { timeout?: Milliseconds }): Promise<MyInfoRes>;
  };
};

/**
 * EVENT (DEFINITIONS)
 */
export type MyEvent = MyInfoReqEvent | MyInfoResEvent;

/**
 * Module info.
 */
export type MyInfoReqEvent = {
  type: 'my.namespace/info:req';
  payload: MyInfoReq;
};
export type MyInfoReq = { tx: string; instance: Id };

export type MyInfoResEvent = {
  type: 'my.namespace/info:res';
  payload: MyInfoRes;
};
export type MyInfoRes = {
  tx: string;
  instance: Id;
  info?: MyInfo;
  error?: string;
};
