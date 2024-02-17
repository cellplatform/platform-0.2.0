import { DEFAULTS, Path, statusOK, type t } from './common';

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
  return async (method, path, body) => {
    // Setup.
    const url = Path.join(base, path);
    const headers = { 'Content-Type': 'application/json' };

    // Fetch.
    console.info(`${method}: ${url}`);
    const res = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    const status = res.status;
    console.info(`${method} complete: ${status}`);

    // Finish up.
    const ok = statusOK(status);
    const json = ok ? await res.json() : {};
    return { ok, status, method, url, json };
  };
}
