import type { t } from '../common/mod.ts';

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

/**
 * Libs
 */
export type HttpLib = {
  readonly Is: t.HttpIs;
  readonly Url: t.HttpUrlLib;
  readonly url: t.HttpUrlLib['create'];
  readonly client: t.HttpClientLib['create'];
};

export type HttpUrlLib = {
  create(base: t.StringUrl | Deno.NetAddr): t.HttpUrl;
  fromAddr(base: Deno.NetAddr): t.HttpUrl;
  fromUrl(base: t.StringUrl): t.HttpUrl;
};

export type HttpClientLib = {
  create(options?: t.HttpFetchClientOptions): t.HttpFetchClient;
};

export type HttpIs = {
  netaddr(input: any): input is Deno.NetAddr;
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
 * An HTTP fetch client instance.
 */
export type HttpFetchClient = {
  readonly contentType: t.StringContentType;
  readonly headers: t.HttpHeaders;
  header(name: t.StringHttpHeaderName): t.StringHttpHeader | undefined;

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
