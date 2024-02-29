import { Url } from './u.Url.ts';

type O = Record<string, unknown>;
type R = RequestInit;
type M = 'GET' | 'PUT' | 'POST' | 'DELETE';

const failedUpstream = (res: Response) => {
  return `Failed upstream api with [${res.status}] ${res.statusText}`.trim();
};

/**
 * HTTP fetch helpers.
 */
export const Http = {
  Url,
  url: Url.build,
  failedUpstream,

  init(args: { accessToken: string }) {
    const headers = {
      Authorization: `Bearer ${args.accessToken}`,
      'Content-Type': 'application/json',
    };

    const http = {
      fetch: (url: string, options?: R) => fetch(url, { ...options, headers }),
      method: (method: M, url: string, options?: R) => http.fetch(url, { ...options, method }),
      get: (url: string) => http.method('GET', url),
      post: (url: string, body: O) => http.method('POST', url, { body: JSON.stringify(body) }),
    } as const;

    return http;
  },
} as const;
