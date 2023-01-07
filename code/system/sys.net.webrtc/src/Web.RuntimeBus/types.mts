import * as t from '../common/types.mjs';

type Id = string;
type Milliseconds = number;

export type WebRuntimeInstance = { bus: t.EventBus<any>; id?: Id };

export type WebRuntimeInfo = {
  module: t.PeerModule;
};

/**
 * Event API
 */
export type WebRuntimeEventsDisposable = WebRuntimeEvents &
  t.Disposable & { clone(): WebRuntimeEvents };

export type WebRuntimeEvents = {
  instance: { bus: Id; id: Id };
  $: t.Observable<t.WebRuntimeEvent>;
  dispose$: t.Observable<any>;

  is: { base(input: any): boolean };

  info: {
    req$: t.Observable<t.WebRuntimeInfoReq>;
    res$: t.Observable<t.WebRuntimeInfoRes>;
    get(options?: { timeout?: Milliseconds }): Promise<WebRuntimeInfoRes>;
  };

  netbus: {
    req$: t.Observable<t.WebRuntimeNetbusReq>;
    res$: t.Observable<t.WebRuntimeNetbusRes>;
    get(options?: { timeout?: Milliseconds }): Promise<WebRuntimeNetbusRes>;
  };
};

/**
 * EVENTS
 */

export type WebRuntimeEvent =
  | WebRuntimeInfoReqEvent
  | WebRuntimeInfoResEvent
  | WebRuntimeNetbusReqEvent
  | WebRuntimeNetbusResEvent;

/**
 * Module info.
 */
export type WebRuntimeInfoReqEvent = {
  type: 'sys.runtime.web/info:req';
  payload: WebRuntimeInfoReq;
};
export type WebRuntimeInfoReq = { tx: string; instance: Id };

export type WebRuntimeInfoResEvent = {
  type: 'sys.runtime.web/info:res';
  payload: WebRuntimeInfoRes;
};
export type WebRuntimeInfoRes = {
  tx: string;
  instance: Id;
  exists: boolean;
  info?: WebRuntimeInfo;
  error?: string;
};

/**
 * Netbus retrieval event
 */
export type WebRuntimeNetbusReqEvent = {
  type: 'sys.runtime.web/netbus:req';
  payload: WebRuntimeNetbusReq;
};
export type WebRuntimeNetbusReq = { tx: string; instance: Id };

export type WebRuntimeNetbusResEvent = {
  type: 'sys.runtime.web/netbus:res';
  payload: WebRuntimeNetbusRes;
};
export type WebRuntimeNetbusRes = {
  tx: string;
  instance: Id;
  exists: boolean;
  netbus?: t.NetworkBus;
  error?: string;
};
