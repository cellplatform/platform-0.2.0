import { Path } from './common';

type O = Record<string, unknown>;

export const HttpUrl = {
  /**
   * Create a URL optionally with query params.
   */
  create(href: string | URL, params?: O) {
    const url = new URL(href);
    if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));
    return url;
  },

  /**
   * A URL helpers scoped to a single hostname.
   */
  origin(domain: string) {
    const url = new URL(domain);
    const origin = url.origin;
    return {
      origin,
      path(path: string, params?: O) {
        const href = Path.join(origin, path);
        return HttpUrl.create(href, params);
      },
    } as const;
  },
} as const;
