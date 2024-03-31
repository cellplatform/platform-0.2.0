import type { t } from './common.mjs';

type Milliseconds = number;

export type HttpRespondInput =
  | t.HttpRespondPayload
  | (() => t.HttpRespondPayload)
  | (() => Promise<t.HttpRespondPayload>);

export type HttpModify = {
  header(key: string, value: string): void;
  headers: {
    merge(headers: t.HttpHeaders): void;
    replace(headers: t.HttpHeaders): void;
  };
};

/**
 * Events
 */
export type HttpEvent = HttpMethodReqEvent | HttpMethodResEvent;

export type HttpMethodReqEvent = { type: 'HTTP/method:req'; payload: HttpMethodReq };
export type HttpMethodReq = {
  tx: string;
  method: t.HttpMethod;
  url: string;
  data?: any;
  headers: t.HttpHeaders;
  isModified: boolean;
  modify: t.HttpModify;
  respond(payload: HttpRespondInput): void; // NB: Used for mocking/testing or providing alternative `fetch` implementations.
};

export type HttpMethodResEvent = { type: 'HTTP/method:res'; payload: HttpMethodRes };
export type HttpMethodRes = {
  tx: string;
  method: t.HttpMethod;
  url: string;
  ok: boolean;
  status: number;
  response: t.HttpResponse;
  elapsed: Milliseconds;
};
