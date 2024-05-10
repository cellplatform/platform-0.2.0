import { DEFAULTS, Delete, statusOK, Time, toUint8Array, type t } from './common';
import { HttpHeaders } from './Http.m.Headers';

const MIME = DEFAULTS.mime;

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
    const headers = wrangle.requestHeaders(options, base, options.body);
    const body = wrangle.requestBody(options);
    if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));

    // Fetch.
    try {
      if (!silent) console.info(`${method}: ${url.href}`);
      const fetched = await fetch(url, { method, headers, body });
      const status = fetched.status;
      const type = wrangle.responseType(fetched);
      if (!silent) console.info(`${method} complete: ${status}, elapsed: ${res.elapsed}`);

      if (type === 'ERROR') return res.error(status);
      if (type === 'text/plain') return res.text(fetched);
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

  requestBody(options: t.HttpFetchOptions) {
    const body = options.body;
    if (!body) return undefined;
    if (body instanceof Uint8Array) return body;
    if (typeof body === 'string') return body;
    return JSON.stringify(body);
  },

  requestHeaders(method: t.HttpFetchOptions, base: t.HttpOptions, body?: t.HttpBodyPayload) {
    const isString = typeof body === 'string';
    const isBinary = body instanceof Uint8Array;
    const specifiedMime = method.contentType ?? base.contentType;
    const type = specifiedMime ?? isBinary ? MIME.binary : isString ? MIME.text : MIME.json;
    const accessToken = method.accessToken ?? base.accessToken;
    const headers = method.headers ?? base.headers;
    return Delete.empty({
      'Content-Type': type,
      Authorization: wrangle.bearer(accessToken),
      ...headers,
    });
  },

  responseStatus(fetched: Response) {
    const status = fetched.status;
    const ok = statusOK(status);
    return { ok, status } as const;
  },

  responseType(fetched: Response): t.HttpResponseType {
    if (!statusOK(fetched.status)) return 'ERROR';
    const contentType = HttpHeaders.value(fetched.headers, 'content-type');
    const parts = contentType.split(';');
    const type = parts.find((text) => text.includes('/'));
    return (type ? type.trim() : 'ERROR') as t.HttpResponseType;
  },

  response(method: t.HttpMethod, url: URL) {
    const timer = Time.timer();
    async function tryOrThrow<T extends t.HttpResponse>(fn: () => Promise<T>) {
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

      text(fetched: Response) {
        return tryOrThrow<t.HttpResponseText>(async () => {
          const { ok, status } = wrangle.responseStatus(fetched);
          const data = await fetched.text();
          return {
            ok,
            status,
            method,
            url: url.href,
            elapsed: api.elapsed.msec,
            type: 'text/plain',
            data,
            header: (key) => HttpHeaders.value(fetched.headers, key),
            get headers() {
              return HttpHeaders.fromRaw(fetched.headers);
            },
          };
        });
      },

      json(fetched: Response) {
        return tryOrThrow<t.HttpResponseJson>(async () => {
          const { ok, status } = wrangle.responseStatus(fetched);
          const data = (await fetched.json()) as t.Json;
          return {
            ok,
            status,
            method,
            url: url.href,
            elapsed: api.elapsed.msec,
            type: 'application/json',
            data,
            header: (key) => HttpHeaders.value(fetched.headers, key),
            json: <T>() => data as T,
            get headers() {
              return HttpHeaders.fromRaw(fetched.headers);
            },
          };
        });
      },

      async binary(fetched: Response) {
        return tryOrThrow<t.HttpResponseBinary>(async () => {
          const { ok, status } = wrangle.responseStatus(fetched);
          const data = await fetched.blob();
          let _binary: Uint8Array | undefined;
          return {
            ok,
            status,
            method,
            url: url.href,
            elapsed: api.elapsed.msec,
            type: 'application/octet-stream',
            data,
            header: (key) => HttpHeaders.value(fetched.headers, key),
            binary: async () => _binary || (_binary = await toUint8Array(data)),
            get headers() {
              return HttpHeaders.fromRaw(fetched.headers);
            },
          };
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
