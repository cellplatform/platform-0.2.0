import { HttpUrl as Url } from './Http.Url.ts';
import { DEFAULTS, type t } from './common.ts';

type Options = t.HttpFetchClientOptions;

/**
 * Http fetch helper.
 */
export const Http = {
  Url,
  url: Url.create,

  /**
   * Create a new fetch client.
   */
  client(options: Options = {}): t.HttpFetchClient {
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
} as const;
