import { type t } from './common';
import { fetcher, toMethods } from './Http.fetch';

/**
 * Client wrapping for the Deno sub-hosting API.
 * https://docs.deno.com/subhosting
 */
export function client(input: t.HttpFetcher | t.HttpOptions) {
  const fetch = typeof input === 'function' ? input : fetcher(input);
  const http = toMethods(fetch);

  const api = {
    /**
     * Projects
     */
    projects: {
      async list(params?: t.DenoListProjectsParams) {
        const url = 'deno/projects';
        const res = await http.get(url, params);
        const { ok, status, json } = res;
        const projects = ok ? (json as t.DenoProject[]) : [];
        return { ok, status, projects };
      },
    },

    /**
     * Deployments
     */
    deployments(projectId: string) {
      return {
        async list(params?: t.DenoListDeploymentsParams) {
          const url = `deno/projects/${projectId}/deployments`;
          const res = await http.get(url, params);
          const { ok, status, json } = res;
          const deployments = ok ? (json as t.DenoDeployment[]) : [];
          return { ok, status, deployments };
        },
      } as const;
    },
  } as const;

  return api;
}
