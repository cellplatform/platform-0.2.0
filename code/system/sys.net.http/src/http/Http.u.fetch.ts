import { DEFAULTS, Delete, statusOK, Time, type t, toUint8Array } from './common';
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
    const res = wrangle.response(method, url);
    const headers = wrangle.headers(options, base);
    const body = options.body ? JSON.stringify(options.body) : undefined;
    if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));

    // Fetch.
    try {
      if (!silent) console.info(`${method}: ${url.href}`);
      const fetched = await fetch(url, { method, headers, body });
      const status = fetched.status;
      const type = wrangle.contentType(fetched);
      if (!silent) console.info(`${method} complete: ${status}, elapsed: ${res.elapsed}`);

      if (type === 'ERROR') return res.error(status);
      if (type === 'application/json') return res.json(fetched);
      if (type === 'application/octet-stream') return res.binary(fetched);
      return res.error(400);
    } catch (err: any) {
      return res.error(400);
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

  contentType(fetched: Response): t.HttpResponseType {
    if (!statusOK(fetched.status)) return 'ERROR';
    const contentType = HttpHeaders.value(fetched.headers, 'content-type');
    const parts = contentType.split(';');
    const type = parts.find((text) => text.includes('/'));
    return (type ? type.trim() : 'ERROR') as t.HttpResponseType;
  },

  status(fetched: Response) {
    const status = fetched.status;
    const ok = statusOK(status);
    return { ok, status } as const;
  },

  response(method: t.HttpMethod, url: URL) {
    const timer = Time.timer();
    async function tryOrError(fn: () => Promise<t.HttpResponse>) {
      try {
        return await fn();
      } catch (err: any) {
        return api.error(400);
      }
    }

    const api = {
      get elapsed() {
        return timer.elapsed;
      },

      json(fetched: Response) {
        return tryOrError(async () => {
          const { ok, status } = wrangle.status(fetched);
          const res: t.HttpResponseJson = {
            ok,
            status,
            method,
            url: url.href,
            elapsed: api.elapsed.msec,
            type: 'application/json',
            data: (await fetched.json()) as t.Json,
            get headers() {
              return HttpHeaders.fromRaw(fetched.headers);
            },
            header: (key) => HttpHeaders.value(fetched.headers, key),
            toJson: <T>() => res.data as T,
          };
          return res;
        });
      },

      async binary(fetched: Response) {
        return tryOrError(async () => {
          const { ok, status } = wrangle.status(fetched);
          let _data: Uint8Array | undefined;
          const res: t.HttpResponseBinary = {
            ok,
            status,
            method,
            url: url.href,
            elapsed: api.elapsed.msec,
            type: 'application/octet-stream',
            data: await fetched.blob(),
            get headers() {
              return HttpHeaders.fromRaw(fetched.headers);
            },
            header: (key) => HttpHeaders.value(fetched.headers, key),
            toUint8Array: async () => _data || (_data = await toUint8Array(res.data)),
          };
          return res;
        });
      },

      error(status: number): t.HttpResponseError {
        return {
          ok: false,
          status,
          method,
          url: url.href,
          elapsed: api.elapsed.msec,
          type: 'ERROR',
          data: undefined,
          headers: {},
          header: (key) => '',
        };
      },
    } as const;

    return api;
  },
} as const;
