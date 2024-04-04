import type { t } from './common';

type O = Record<string, unknown>;

export type HttpMethod = 'HEAD' | 'GET' | 'PUT' | 'POST' | 'DELETE' | 'PATCH' | 'OPTIONS';
export type HttpHeaders = { [key: string]: string };
export type HttpFetchInput = t.HttpFetcher | t.HttpOptions;

export type HttpOptions = {
  headers?: t.HttpHeaders;
  contentType?: string;
  accessToken?: string; // JWT: https://www.rfc-editor.org/rfc/rfc7519
  silent?: boolean; // Supress console logging.
};

/**
 * Fetcher
 */
export type HttpFetcher = (
  method: t.HttpMethod,
  url: string,
  options?: HttpFetchOptions,
) => Promise<HttpResponse>;

export type HttpFetchOptions = {
  headers?: t.HttpHeaders;
  body?: O;
  params?: O;
  contentType?: string;
  accessToken?: string;
};

/**
 * Http Methods
 */
export type HttpMethods = {
  get(path: string, params?: O): Promise<HttpResponse>;
  put(path: string, body: O, params?: O): Promise<HttpResponse>;
  post(path: string, body: O, params?: O): Promise<HttpResponse>;
  patch(path: string, body: O, params?: O): Promise<HttpResponse>;
  delete(path: string, params?: O): Promise<HttpResponse>;
};

/**
 * Response
 */

export type HttpResponse = HttpResponseJson | HttpResponseBinary | HttpResponseError;
export type HttpResponseType = HttpResponse['type'];
export type HttpResponseSuccess = Exclude<HttpResponse, HttpResponseError>;

export type HttpResponseCommon = {
  readonly ok: boolean;
  readonly status: number;
  readonly method: HttpMethod;
  readonly url: string;
  readonly elapsed: t.Msecs;
  readonly headers: t.HttpHeaders;
  header(key: string): string;
};

export type HttpResponseJson = HttpResponseCommon & {
  readonly type: 'application/json';
  readonly data: t.Json;
  toJson<T extends t.Json>(): T;
};

export type HttpResponseBinary = HttpResponseCommon & {
  readonly type: 'application/octet-stream';
  readonly data: Blob;
  toUint8Array(): Promise<Uint8Array>;
};

export type HttpResponseError = HttpResponseCommon & {
  readonly type: 'ERROR';
  readonly data: undefined;
};
