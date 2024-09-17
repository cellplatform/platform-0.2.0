import { DEFAULTS, type t } from './common.ts';

type O = Record<string, unknown>;
type Options = t.HttpFetchClientOptions;

/**
 * An HTTP client
 * (utility shim over <fetch>).
 */
export const Client: t.HttpClientLib = {
  /**
   * HTTP client factory.
   */
  create(options: Options = {}): t.HttpFetchClient {
    const client: t.HttpFetchClient = {
      get headers() {
        const accessToken = wrangle.accessToken(options);
        const contentType = client.contentType;
        const headers: t.HttpHeaders = { 'Content-Type': contentType };
        if (accessToken) headers['Authorization'] = accessToken;
        return headers;
      },

      get contentType() {
        return wrangle.contentType(options);
      },

      header(name) {
        return (client.headers as any)[name] ?? '';
      },

      fetch(url, options) {
        const headers = client.headers;
        return fetch(url, { ...options, headers });
      },
      method(method, url, options) {
        return client.fetch(url, { ...options, method });
      },

      get: (url: string, options) => client.method('GET', url, options),
      head: (url: string, options) => client.method('HEAD', url, options),
      options: (url: string, options) => client.method('OPTIONS', url, options),

      put(url: string, data, options) {
        const body = wrangle.body(client.contentType, data, options);
        return client.method('PUT', url, { ...options, body });
      },
      post(url: string, data, options) {
        const body = wrangle.body(client.contentType, data, options);
        return client.method('POST', url, { ...options, body });
      },
      patch(url: string, data, options) {
        const body = wrangle.body(client.contentType, data, options);
        return client.method('PATCH', url, { ...options, body });
      },

      delete(url: string, options) {
        return client.method('DELETE', url, options);
      },
    };
    return client;
  },
} as const;

/**
 * Helpers
 */
const wrangle = {
  accessToken(options: Options): string {
    const accessToken = options.accessToken;
    if (typeof accessToken === 'function') return accessToken();
    if (typeof accessToken === 'string') return `Bearer ${accessToken}`;
    return '';
  },

  contentType(options: Options): string {
    const { contentType = DEFAULTS.contentType } = options;
    if (typeof contentType === 'function') return contentType();
    return contentType;
  },

  body(contentType: t.StringContentType, data: O, options?: RequestInit) {
    const body = JSON.stringify(data);
    return body;
  },
} as const;
