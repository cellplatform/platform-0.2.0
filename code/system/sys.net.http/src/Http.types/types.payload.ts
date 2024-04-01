import type { Json, t } from './common';

type O = Record<string, unknown>;

/**
 * Request
 */
export type HttpRequestPayload = {
  url: string;
  method: t.HttpMethod;
  mode?: t.HttpCors;
  headers?: t.HttpHeaders;
  data?: O | string;
};

/**
 * Response
 */
export type HttpResponse = {
  ok: boolean;
  status: number;
  statusText: string;
  headers: t.HttpHeaders;
  contentType: HttpContentType;
  body?: ReadableStream<Uint8Array>;
  text: string;
  json: Json;
};

export type HttpContentType = {
  mime: string;
  is: HttpContentTypeIs;
  toString(): string;
};

export type HttpContentTypeIs = {
  json: boolean;
  text: boolean;
  binary: boolean;
};

/**
 * Respond (method)
 */
export type HttpRespondPayload = {
  status: number;
  statusText?: string;
  headers?: t.HttpHeaders;
  data?: ReadableStream<Uint8Array> | O | string;
};
