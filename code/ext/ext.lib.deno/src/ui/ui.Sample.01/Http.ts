import { DEFAULTS } from './common';

const Api = {
  /**
   * Retrieve relevant end-point URL.
   */
  origin(forcePublic = false) {
    const origins = DEFAULTS.origins;
    const isLocalhost = location.hostname === 'localhost';
    const useLocal = isLocalhost && !forcePublic;
    const url = useLocal ? origins.local : origins.prod;
    return url;
  },

  /**
   * GET/POST helpers.
   */
  http(options: { forcePublic?: boolean } = {}) {
    const { forcePublic } = options;
    return {
      get: (path: string) => Api.fetch('GET', path, { forcePublic }),
      post: (path: string, body: BodyInit) => Api.fetch('POST', path, { body, forcePublic }),
    } as const;
  },

  /**
   * Invoke an HTTP request against the API.
   */
  async fetch(
    method: 'GET' | 'POST',
    path: string,
    options: { forcePublic?: boolean; body?: BodyInit } = {},
  ) {
    // Setup.
    const { body } = options;
    const origin = Api.origin(options.forcePublic);
    const url = `${origin}/${path}`;
    const headers = { 'Content-Type': 'application/json' };

    // Fetch.
    console.info(`fetching: ${url}`);
    const res = await fetch(url, { method, headers, body });
    const status = res.status;
    console.info(`fetched: ${status}`);

    // Finish up.
    const json = await res.json();
    return { status, method, url, json } as const;
  },
};

export const Http = { Api } as const;
