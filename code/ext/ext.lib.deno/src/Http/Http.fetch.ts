import { DEFAULTS, Path, statusOK, type t } from './common';

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
  return async (method, path, options = {}) => {
    // Prepare.
    const url = new URL(Path.join(base, path));
    const headers = { 'Content-Type': 'application/json' };
    const body = options.body ? JSON.stringify(options.body) : undefined;
    if (options.params) {
      Object.entries(options.params).forEach(([k, v]) => url.searchParams.set(k, String(v)));
    }

    // Fetch.
    console.info(`${method}: ${url.href}`);
    const res = await fetch(url, { method, headers, body });
    const status = res.status;
    console.info(`${method} complete: ${status}`);

    // Finish up.
    const ok = statusOK(status);
    const json = ok ? await res.json() : {};
    return { ok, status, method, url: url.href, json };
  };
}

/**
 * HTTP helper methods.
 */
export function toMethods(fetcher: t.HttpFetcher): t.HttpFetchMethods {
  return {
    get: (path: string, params?: O) => fetcher('GET', path, { params }),
    post: (path: string, body: O, params?: O) => fetcher('POST', path, { body, params }),
    delete: (path: string, params?: O) => fetcher('DELETE', path, { params }),
  };
}
