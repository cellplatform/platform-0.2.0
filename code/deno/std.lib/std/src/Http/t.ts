import type { t } from '../common/mod.ts';

type M = t.HttpMethod;
type R = RequestInit;
type O = Record<string, unknown>;

/**
 * @external
 */

/**
 * map to: /sys.types
 */
export type HttpMethod = 'HEAD' | 'GET' | 'PUT' | 'POST' | 'DELETE' | 'PATCH' | 'OPTIONS';
export type HttpHeaders = { [key: HttpHeaderName]: StringHttpHeader };
export type HttpHeaderName = string;

// 🐷 NB: Duplicated from:
// import type { HttpMethod } from '../../../../../sys/sys.net.http/src/types.ts';

/**
 * @module
 */
export type StringContentType = string;
export type StringJwt = string;
export type StringHttpHeader = string;
export type StringUrl = string;

/**
 * Library: URL
 */
export type HttpUrlLib = {
  create(base: t.StringUrl): t.HttpUrl;
};

/**
 * Represents a URL endpoint of an HTTP service.
 */
export type HttpUrl = {
  readonly base: string;
  join(...parts: string[]): string;
  toString(): string;
};

/**
 * Library: HttpClient
 */
export type HttpClientLib = {
  create(options?: t.HttpFetchClientOptions): t.HttpFetchClient;
};
export type HttpFetchClientOptions = {
  accessToken?: t.StringJwt | (() => t.StringJwt);
  contentType?: t.StringContentType | (() => t.StringContentType);
};

/**
 * An HTTP fetch client instance.
 */
export type HttpFetchClient = {
  readonly contentType: t.StringContentType;
  readonly headers: {};
  header(name: t.HttpHeaderName): t.StringHttpHeader;

  fetch(url: t.StringUrl, options?: RequestInit): Promise<Response>;
  method(method: t.HttpMethod, url: t.StringUrl, options?: RequestInit): Promise<Response>;

  get(url: t.StringUrl, options?: RequestInit): Promise<Response>;
  head(url: t.StringUrl, options?: RequestInit): Promise<Response>;
  options(url: t.StringUrl, options?: RequestInit): Promise<Response>;

  put(url: t.StringUrl, body: O, options?: RequestInit): Promise<Response>;
  post(url: t.StringUrl, body: O, options?: RequestInit): Promise<Response>;
  patch(url: t.StringUrl, body: O, options?: RequestInit): Promise<Response>;

  delete(url: t.StringUrl, options?: RequestInit): Promise<Response>;
};
