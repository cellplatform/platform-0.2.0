import * as t from '../common/types.mjs';

type Id = string;
type Milliseconds = number;
type Semver = string;

export type DevInfo = {
  module: { name: string; version: Semver };
};

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
    get(options?: { timeout?: Milliseconds }): Promise<DevInfoRes>;
  };
};

/**
 * EVENT (DEFINITIONS)
 */
export type DevEvent = DevInfoReqEvent | DevInfoResEvent;

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
export type DevInfoRes = {
  tx: string;
  instance: Id;
  info?: DevInfo;
  error?: string;
};
