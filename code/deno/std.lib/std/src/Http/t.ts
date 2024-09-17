import type { t } from '../common/mod.ts';

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

/**
 * Represents a URL endpoing of an HTTP service.
 */
export type HttpUrl = {
  readonly base: string;
  join(...parts: string[]): string;
  toString(): string;
};

/**
 * An HTTP fetch client.
 */
export type HttpFetchClient = {
  readonly headers: {};
  readonly contentType: t.StringContentType;
  header(name: t.HttpHeaderName): t.StringHttpHeader;
};

export type HttpFetchClientOptions = {
  accessToken?: t.StringJwt | (() => t.StringJwt);
  contentType?: t.StringContentType | (() => t.StringContentType);
};
