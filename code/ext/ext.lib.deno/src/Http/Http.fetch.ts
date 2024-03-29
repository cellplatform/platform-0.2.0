import { DEFAULTS, Delete, Path, statusOK, type t } from './common';

type O = Record<string, unknown>;

/**
 * Determing the HTTP origin URL.
 */
export function origin(options: t.HttpOptions = {}) {
  const { forcePublic = false } = options;
  const origins = {
    local: options.origins?.local ?? DEFAULTS.origins.local,
    remote: options.origins?.remote ?? DEFAULTS.origins.remote,
  };

  const isLocalhost = location.hostname === 'localhost';
  const useLocal = isLocalhost && !forcePublic;
  return useLocal ? origins.local : origins.remote;
}

/**
 * Initialize a new HTTP fetcher
 */
export function fetcher(options: t.HttpOptions = {}): t.HttpFetcher {
  const base = origin(options);
  const jwt = options.accessToken;
  const headers = Delete.empty({
    'Content-Type': 'application/json',
    Authorization: jwt ? `Bearer ${jwt}` : '',
  } as const);

  return async (method, path, options = {}) => {
    // Prepare.
    const { params } = options;
    const url = new URL(Path.join(base, path));
    const body = options.body ? JSON.stringify(options.body) : undefined;
    if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));

    // Fetch.
    try {
      console.info(`${method}: ${url.href}`);
      const res = await fetch(url, { method, headers, body });
      const status = res.status;
      console.info(`${method} complete: ${status}`);

      // Finish up.
      const ok = statusOK(status);
      const json = ok ? await res.json() : {};
      return { ok, status, method, url: url.href, json };
    } catch (error) {
      return { ok: false, status: 500, method, url: url.href, json: {} };
    }
  };
}

/**
 * HTTP helper methods.
 */
export function toMethods(fetcher: t.HttpFetcher): t.HttpFetchMethods {
  return {
    get: (path: string, params?: O) => fetcher('GET', path, { params }),
    put: (path: string, body: O, params?: O) => fetcher('PUT', path, { body, params }),
    post: (path: string, body: O, params?: O) => fetcher('POST', path, { body, params }),
    delete: (path: string, params?: O) => fetcher('DELETE', path, { params }),
  };
}
