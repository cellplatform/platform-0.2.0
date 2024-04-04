import { Http } from 'sys.net.http';
import { origin } from './Http.u';
import { type t } from './common';

/**
 * Client wrapping for the Deno sub-hosting API.
 * https://docs.deno.com/subhosting
 */
export function client(options: t.DenoHttpOptions) {
  const { accessToken } = options;
  const domain = origin(options);
  const http = Http.origin({ accessToken }, domain);

  const api = {
    domain,

    /**
     * Projects
     */
    projects: {
      async list(params?: t.DenoListProjectsParams) {
        const path = 'deno/projects';
        const res = await http.get(path, params);
        const { ok, status, data } = res;
        const projects = ok ? (data as t.DenoProject[]) : [];
        return { ok, status, projects };
      },
    },

    /**
     * Deployments
     */
    deployments(projectId: string) {
      return {
        async list(params?: t.DenoListDeploymentsParams) {
          const path = `deno/projects/${projectId}/deployments`;
          const res = await http.get(path, params);
          const { ok, status, data } = res;
          const deployments = ok ? (data as t.DenoDeployment[]) : [];
          return { ok, status, deployments };
        },
      } as const;
    },
  } as const;

  return api;
}
