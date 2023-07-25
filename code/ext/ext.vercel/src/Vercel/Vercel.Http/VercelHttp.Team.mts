import { type t } from './common/index.mjs';
import { VercelHttpTeamDeployment } from './VercelHttp.Team.Deployment.mjs';
import { VercelHttpTeamProject } from './VercelHttp.Team.Project.mjs';

export function VercelHttpTeam(args: { ctx: t.Ctx; teamId: string }): t.VercelHttpTeam {
  const { ctx, teamId } = args;
  const { headers, http } = ctx;

  const api: t.VercelHttpTeam = {
    id: teamId,

    /**
     * Retrieve team information.
     * https://vercel.com/docs/api#endpoints/teams/get-single-team-information
     */
    async info() {
      const url = ctx.url(1, `teams/${teamId}`);
      const res = await http.get(url, { headers });
      const { ok, status } = res;
      const json = res.json as any;
      const team = (!ok ? {} : json) as t.VercelTeam;
      const error = ok ? undefined : (json.error as t.VercelHttpError);
      return { ok, status, team, error };
    },

    /**
     * List projects.
     * https://vercel.com/docs/api#endpoints/projects
     */
    async projects(options = {}) {
      const url = ctx.url(8, 'projects', { ...options, teamId });
      const res = await http.get(url, { headers });
      const { ok, status } = res;
      const json = res.json as any;
      const projects = !ok ? [] : (json.projects as t.VercelProject[]);
      const error = ok ? undefined : (json.error as t.VercelHttpError);
      return { ok, status, projects, error };
    },

    /**
     * Work on a single project within the team.
     */
    project(name) {
      return VercelHttpTeamProject({ ctx, name, team: api });
    },

    /**
     * List deployments.
     * https://vercel.com/docs/api#endpoints/deployments/list-deployments
     */
    async deployments(options = {}) {
      /**
       * TODO 🐷
       * - options passed into URL query builder.
       */

      const url = ctx.url(5, 'now/deployments', { teamId });

      const res = await http.get(url, { headers });
      const { ok, status } = res;
      const json = res.json as any;
      const deployments = !ok ? [] : (json.deployments as t.VercelListDeployment[]);
      const error = ok ? undefined : (json.error as t.VercelHttpError);
      return { ok, status, deployments, error };
    },

    /**
     * Work on a single deployment within a team.
     */
    deployment(url) {
      return VercelHttpTeamDeployment({ ctx, url, team: api });
    },
  };

  return api;
}
