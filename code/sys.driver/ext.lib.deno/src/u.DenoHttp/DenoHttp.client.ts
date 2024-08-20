import { Http } from 'sys.net.http';
import { origin } from './DenoHttp.origin';
import { Time, type t } from './common';

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

    /**
     * Create a new deployment.
     */
    async deploy(project: t.IdString, body: t.DenoDeployArgs) {
      const path = `deno/projects/${project}/deployments`;
      const res = await http.post(path, body);

      const { ok, status } = res;
      const data = res.data as any;
      const id = String(typeof data === 'object' ? data?.id ?? '' : '');

      const whenReady = async (options: { retry?: number } = {}) => {
        const { retry = 3 } = options;
        const list = await api.deployments(project).list();
        const match = list.deployments.find((item) => item.id === id);

        if ((!match || match.status !== 'success') && retry > 0) {
          await Time.wait(1500);
          return whenReady({ retry: retry - 1 });
        }

        return match;
      };

      return { ok, status, id, whenReady };
    },
  } as const;

  return api;
}
