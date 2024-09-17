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
export type HttpHeaders = { readonly [key: t.StringHttpHeaderName]: t.StringHttpHeader };

// 🐷 NB: Duplicated from:
// import type { HttpMethod } from '../../../../../sys/sys.net.http/src/types.ts';

/**
 * @module
 */
export type StringContentType = string;
export type StringJwt = string;
export type StringHttpHeader = string;
export type StringHttpHeaderName = string;
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

/**
 * An HTTP fetch client instance.
 */
export type HttpFetchClient = {
  readonly contentType: t.StringContentType;
  readonly headers: t.HttpHeaders;
  header(name: t.StringHttpHeaderName): t.StringHttpHeader;

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

export type HttpFetchClientOptions = {
  accessToken?: t.StringJwt | (() => t.StringJwt);
  contentType?: t.StringContentType | (() => t.StringContentType);
  headers?: t.HttpFetchClientMutateHeaders;
};

export type HttpFetchClientMutateHeaders = (e: HttpFetchClientMutateHeadersArgs) => void;
export type HttpFetchClientMutateHeadersArgs = {
  readonly headers: t.HttpHeaders;
  get(name: string): t.StringHttpHeader;
  set(name: string, value: string | number | null): HttpFetchClientMutateHeadersArgs;
};
