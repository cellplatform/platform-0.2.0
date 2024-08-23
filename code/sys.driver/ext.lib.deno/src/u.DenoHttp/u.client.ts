import { Http } from 'sys.net.http';
import { DEFAULTS, Time, type t } from './common';
import { origin } from './u.origin';

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
     * Projects.
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
     * Deployments.
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
      const deploymentId = String(typeof data === 'object' ? data?.id ?? '' : '');

      /**
       * Poll the deployment.
       */
      const whenReady = async (options: t.WhenReadyOptions = {}) => {
        const { silent = true } = options;
        const total = options.retry ?? DEFAULTS.deploy.retries;
        const delays = Array.from({ length }).map(() => DEFAULTS.deploy.delay);

        const log = (...input: any[]) => {
          if (silent) return;
          console.info(...input);
        };

        log(`(when ready): polling deployment "${deploymentId}" |→ ${api.url.endpoint}`);

        const done = (ok: boolean, deployment?: t.DenoDeployment): t.WhenReadyResponse => {
          const status: t.WhenReadyStatus = !ok ? 'failed' : deployment?.status ?? 'UNKNOWN';
          log(`(when ready: done) deployment:${deployment}, ok: ${ok}, status: ${status}`);
          const id = { deployment: deploymentId, project };
          return { ok, status, id, deployment };
        };

        let i = 0;
        for (const msecs of delays) {
          i++;
          const list = await api.deployments(project).list({ sort: 'created_at', order: 'desc' });
          const match = list.deployments.find((item) => item.id === deploymentId);
          if (match?.status === 'success') {
            return done(true, match);
          } else {
            const delay = Time.duration(msecs).toString();
            log(`${i} of ${total} |→ deployment not ready, waiting for ${delay}...`);
            await Time.wait(msecs);
          }
        }

        return done(false);
      };

      return {
        ok,
        status,
        deploymentId,
        whenReady,
      };
    },
  } as const;

  return api;
}
