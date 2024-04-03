import { Delete, statusOK, type t } from './common';
import { HttpHeaders } from './Http.m.Headers';

/**
 * Initialize a new HTTP fetcher
 */
export function fetcher(options: t.HttpOptions = {}): t.HttpFetcher {
  const { accessToken, contentType = 'application/json', silent = true } = options;
  const baseHeaders = Delete.empty({
    'Content-Type': contentType,
    Authorization: accessToken ? `Bearer ${accessToken}` : '',
  } as const);

  return async (method, address, options = {}) => {
    // Prepare.
    const { params } = options;
    const url = new URL(address);
    const body = options.body ? JSON.stringify(options.body) : undefined;
    if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));

    // Fetch.
    try {
      if (!silent) console.info(`${method}: ${url.href}`);
      const headers = {
        ...baseHeaders,
        'Content-Type': options.contentType ?? contentType,
      };
      const fetched = await fetch(url, { method, headers, body });
      const status = fetched.status;
      if (!silent) console.info(`${method} complete: ${status}`);

      // Finish up.
      const ok = statusOK(status);
      const data = ok ? await wrangle.data(fetched) : {};

      type R = t.HttpResponseBinary | t.HttpResponseJson;
      const mime = HttpHeaders.value(fetched.headers, 'content-type');
      const res: R = {
        ok,
        status,
        method,
        url: url.href,
        contentType: mime as R['contentType'],
        data: data as any,
        get headers() {
          return HttpHeaders.fromRaw(fetched.headers);
        },
      };
      return res;
    } catch (err: any) {
      const error: t.HttpResponseError = {
        ok: false,
        status: 500,
        method,
        url: url.href,
        contentType: 'ERROR',
        data: undefined,
        headers: {},
      };
      return error;
    }
  };
}

/**
 * Helpers
 */
const wrangle = {
  async data(res: Response): Promise<t.Json | Blob | undefined> {
    const type = HttpHeaders.value(res.headers, 'content-type');
    if (type === HttpHeaders.mime.json) return res.json();
    if (type === HttpHeaders.mime.binary) return res.blob();
    return undefined;
  },
} as const;
