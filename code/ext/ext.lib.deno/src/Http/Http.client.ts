import { type t } from './common';
import { fetcher, methods } from './Http.fetch';

/**
 * Client wrapping for the Deno sub-hosting API.
 * https://docs.deno.com/subhosting
 */
export function client(input: t.HttpFetcher | t.HttpOptions) {
  const fetch = typeof input === 'function' ? input : fetcher(input);
  const http = methods(fetch);

  const api = {
    /**
     * Projects
     */
    projects: {
      async list(params?: t.DenoProjectListParams) {
        const res = await http.get('deno/hosting/projects', params);
        const { ok, status, json } = res;
        const projects = ok ? (json as t.DenoProject[]) : [];
        return { ok, status, projects };
      },
    },
  } as const;

  return api;
}
