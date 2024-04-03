import type { t } from './common';

type O = Record<string, unknown>;

export type HttpMethod = 'HEAD' | 'GET' | 'PUT' | 'POST' | 'DELETE' | 'PATCH' | 'OPTIONS';
export type HttpHeaders = { [key: string]: string };

export type HttpOptions = {
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
  options?: { body?: O; params?: O; contentType?: string },
) => Promise<HttpResponse>;

/**
 * Http Methods
 */
export type HttpFetchMethods = {
  get(path: string, params?: O): Promise<HttpResponse>;
  put(path: string, body: O, params?: O): Promise<HttpResponse>;
  post(path: string, body: O, params?: O): Promise<HttpResponse>;
  patch(path: string, body: O, params?: O): Promise<HttpResponse>;
  delete(path: string, params?: O): Promise<HttpResponse>;
};

/**
 * Response
 */
type CommonRespone = {
  method: HttpMethod;
  url: string;
  ok: boolean;
  status: number;
  headers: t.HttpHeaders;
};

export type HttpResponse = HttpResponseJson | HttpResponseBinary | HttpResponseError;

export type HttpResponseJson = CommonRespone & {
  contentType: 'application/json';
  data: t.Json;
};

export type HttpResponseBinary = CommonRespone & {
  contentType: 'application/octet-stream';
  data: Blob;
};

export type HttpResponseError = CommonRespone & {
  contentType: 'ERROR';
  data: undefined;
};
