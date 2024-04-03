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
      const data = ok ? await wrangle.data(fetched) : {};

      type R = t.HttpResponseBinary | t.HttpResponseJson;
      const type = HttpHeaders.value(fetched.headers, 'content-type') as R['type'];
      const res: R = {
        ok,
        status,
        method,
        url: url.href,
        type,
        data: data as any,
        get headers() {
          return HttpHeaders.fromRaw(fetched.headers);
        },
        header: (key) => HttpHeaders.value(fetched.headers, key),
      };
      return res;
    } catch (err: any) {
      const error: t.HttpResponseError = {
        ok: false,
        status: 500,
        method,
        url: url.href,
        type: 'ERROR',
        data: undefined,
        headers: {},
        header: (key) => '',
      };
      return error;
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

  async data(res: Response): Promise<t.Json | Blob | undefined> {
    const type = HttpHeaders.value(res.headers, 'content-type');
    if (type === HttpHeaders.mime.json) return res.json();
    if (type === HttpHeaders.mime.binary) return res.blob();
    return undefined;
  },
} as const;
