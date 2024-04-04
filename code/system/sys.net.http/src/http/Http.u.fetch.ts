import { DEFAULTS, Delete, statusOK, type t } from './common';
import { HttpHeaders } from './Http.m.Headers';

/**
 * Initialize a new HTTP fetcher
 */
export function fetcher(options: t.HttpOptions = {}): t.HttpFetcher {
  const { silent = true } = options;
  const base = options;

  return async (method, address, options = {}) => {
    // Prepare.
    const { params } = options;
    const url = new URL(address);
    const body = options.body ? JSON.stringify(options.body) : undefined;
    if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));

    // Fetch.
    try {
      if (!silent) console.info(`${method}: ${url.href}`);
      const headers = wrangle.headers(options, base);
      const fetched = await fetch(url, { method, headers, body });
      const status = fetched.status;
      if (!silent) console.info(`${method} complete: ${status}`);

      // Finish up.
      const ok = statusOK(status);
      const type = wrangle.contentType(fetched.headers);
      const data = ok ? await wrangle.data(type, fetched) : {};
      if (type === 'ERROR') return wrangle.error(400, method, url.href);

      /**
       * Success
       */
      const res: t.HttpResponseSuccess = {
        ok,
        status,
        method,
        url: url.href,
        type,
        data: data as any, // NB: type hack.
        get headers() {
          return HttpHeaders.fromRaw(fetched.headers);
        },
        header: (key) => HttpHeaders.value(fetched.headers, key),
      };
      return res;
    } catch (err: any) {
      return wrangle.error(500, method, url.href);
    }
  };
}

/**
 * Helpers
 */
const wrangle = {
  bearer(jwt?: string) {
    return jwt ? `Bearer ${jwt}` : '';
  },

  headers(method: t.HttpFetchOptions, base: t.HttpOptions) {
    const mime = method.contentType ?? base.contentType ?? DEFAULTS.mime.json;
    const accessToken = method.accessToken ?? base.accessToken;
    const headers = method.headers ?? base.headers;
    return Delete.empty({
      'Content-Type': mime,
      Authorization: wrangle.bearer(accessToken),
      ...headers,
    });
  },

  async data(type: t.HttpResponseType, res: Response): Promise<t.Json | Blob | undefined> {
    if (type === HttpHeaders.Mime.json) return res.json();
    if (type === HttpHeaders.Mime.binary) return res.blob();
    return undefined;
  },

  contentType(headers: Headers): t.HttpResponseType {
    const contentType = HttpHeaders.value(headers, 'content-type');
    const parts = contentType.split(';');
    const type = parts.find((text) => text.includes('/'));
    return (type ? type.trim() : 'ERROR') as t.HttpResponseType;
  },

  error(status: number, method: t.HttpMethod, url: string): t.HttpResponseError {
    return {
      ok: false,
      status,
      method,
      url,
      type: 'ERROR',
      data: undefined,
      headers: {},
      header: (key) => '',
    };
  },
} as const;
