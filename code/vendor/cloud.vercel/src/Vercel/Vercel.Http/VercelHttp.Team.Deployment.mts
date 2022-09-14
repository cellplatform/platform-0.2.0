import { t, Delete } from './common/index.mjs';
import { VercelHttpDeploymentFiles } from './VercelHttp.Files.Deployment.mjs';

type Url = string;

export function VercelHttpTeamDeployment(args: {
  ctx: t.Ctx;
  url: Url; // "<id>.vercel.app" or alias url.
  team: t.VercelHttpTeam;
}): t.VercelHttpTeamDeployment {
  const { ctx, team } = args;
  const teamId = team.id;
  const { http, headers } = ctx;

  const api: t.VercelHttpTeamDeployment = {
    url: (args.url ?? '').trim().replace(/^https\:\/\//, ''),
    team,

    /**
     * Determine if the project exists.
     */
    async exists() {
      const res = await api.info();
      return res.status.toString().startsWith('2');
    },

    /**
     * Retrieve team information.
     * https://vercel.com/docs/api#endpoints/deployments/get-a-single-deployment
     */
    async info() {
      const url = ctx.url(11, `now/deployments/get`, { url: api.url, teamId });
      const res = await http.get(url, { headers });
      const { ok, status } = res;
      const json = res.json as any;
      const deployment = (!ok ? {} : json) as t.VercelDeployment;
      const error = ok ? undefined : (json.error as t.VercelHttpError);
      return Delete.undefined({ ok, status, deployment, error });
    },

    /**
     * List deployment files.
     * https://vercel.com/docs/api#endpoints/deployments/list-deployment-files
     */
    async files() {
      const info = await api.info();
      const deploymentId = info.deployment?.id;

      const url = ctx.url(11, `now/deployments/${deploymentId}/files`, { teamId });
      const res = await http.get(url, { headers });
      const { ok, status } = res;
      const json = res.json as any;

      const files = (
        !ok
          ? {}
          : VercelHttpDeploymentFiles({
              ctx,
              teamId,
              deploymentId,
              url: info.deployment.url || '',
              list: json as t.VercelDeploymentFile[],
            })
      ) as t.VercelHttpDeploymentFiles;

      const error = ok ? undefined : (json.error as t.VercelHttpError);
      return Delete.undefined({ ok, status, files, error });
    },
  };

  return api;
}
