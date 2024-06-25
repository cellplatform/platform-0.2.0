import { Http } from 'sys.net.http';
import { origin } from './DenoHttp.origin';
import { type t } from './common';

/**
 * Client wrapping for the Deno sub-hosting API.
 * https://docs.deno.com/subhosting
 */
export function client(options: t.DenoHttpOptions) {
  const { accessToken } = options;
  const endpoint = origin(options);
  const http = Http.origin({ accessToken }, endpoint);

  const api: t.DenoHttpClient = {
    url: {
      endpoint,
      host: new URL(endpoint).host,
    },

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
    deployments(project: t.IdString) {
      return {
        async list(params?: t.DenoListDeploymentsParams) {
          const path = `deno/projects/${project}/deployments`;
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
