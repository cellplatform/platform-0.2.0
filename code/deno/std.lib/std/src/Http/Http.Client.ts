import { DEFAULTS, type t } from './common.ts';

type O = Record<string, unknown>;
type R = RequestInit;
type C = t.HttpFetchClient;
type Options = t.HttpFetchClientOptions;

/**
 * An HTTP client
 * (utility shim over <fetch>).
 */
export const Client: t.HttpClientLib = {
  /**
   * HTTP client factory.
   */
  create(options: Options = {}): C {
    const method: C['method'] = (method, url, options) => api.fetch(url, { ...options, method });
    const bodyMethod = (method: t.HttpMethod, url: string, data: O, options?: R) => {
      const body = JSON.stringify(data);
      return api.method(method, url, { ...options, body });
    };

    const api: t.HttpFetchClient = {
      get contentType() {
        return wrangle.contentType(options);
      },

      get headers() {
        const accessToken = wrangle.accessToken(options);
        const contentType = api.contentType;
        const headers: t.HttpHeaders = { 'Content-Type': contentType };
        if (accessToken) headers['Authorization'] = accessToken;
        return headers;
      },

      header: (name) => (api.headers as any)[name] ?? '',

      fetch: (url, options) => fetch(url, { ...options, headers: api.headers }),
      method,

      get: (url, options) => method('GET', url, options),
      head: (url, options) => method('HEAD', url, options),
      options: (url, options) => method('OPTIONS', url, options),

      put: (url, data, options) => bodyMethod('PUT', url, data, options),
      post: (url, data, options) => bodyMethod('POST', url, data, options),
      patch: (url, data, options) => bodyMethod('PATCH', url, data, options),

      delete: (url, options) => method('DELETE', url, options),
    };
    return api;
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
} as const;
