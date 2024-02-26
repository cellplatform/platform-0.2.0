import { Env, Path } from './u.common.ts';

type O = Record<string, unknown>;

const { accessToken } = Env.Vars.deno;
const headers = {
  Authorization: `Bearer ${accessToken}`,
  'Content-Type': 'application/json',
};

const join = Path.join;
const base = 'https://api.deno.com/v1';

const failedUpstream = (res: Response) => {
  return `Failed upstream api with [${res.status}] ${res.statusText}`.trim();
};

/**
 * Deno URL helpers.
 */
export const Url = {
  join,
  base,
  build: (...parts: string[]) => join(base, ...parts),
} as const;

/**
 * HTTP fetch helpers.
 */
export const Http = {
  Url,
  url: Url.build,
  failedUpstream,

  fetch: (url: string, options?: RequestInit) => fetch(url, { ...options, headers }),
  get: (url: string) => Http.fetch(url, { method: 'GET' }),
  post: (url: string, body: O) => Http.fetch(url, { method: 'POST', body: JSON.stringify(body) }),
} as const;
