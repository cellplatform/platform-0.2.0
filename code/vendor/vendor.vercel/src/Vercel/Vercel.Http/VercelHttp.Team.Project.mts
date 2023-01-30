import { t, Delete } from './common/index.mjs';
import { VercellHttpDeploy } from './VercelHttp.Deploy.mjs';

export function VercelHttpTeamProject(args: {
  ctx: t.Ctx;
  name: string;
  team: t.VercelHttpTeam;
}): t.VercelHttpTeamProject {
  const { ctx, team } = args;
  const { http, headers } = ctx;

  const name = (args.name ?? '').trim();
  const teamId = team.id;

  if (!name) throw new Error(`Project name not specified`);

  const api: t.VercelHttpTeamProject = {
    name,
    team,

    /**
     * Determine if the project exists.
     */
    async exists() {
      const res = await api.info();
      return res.status.toString().startsWith('2');
    },

    /**
     * Retrieve project information.
     * https://vercel.com/docs/api#endpoints/projects/get-a-single-project
     */
    async info() {
      const url = ctx.url(8, `projects/${name}`, { teamId });
      const res = await http.get(url, { headers });
      const { ok, status } = res;
      const json = res.json as any;
      const project = (!ok ? {} : json) as t.VercelProject;
      const error = ok ? undefined : (json.error as t.VercelHttpError);
      return Delete.undefined({ ok, status, project, error });
    },

    /**
     * Create a new project.
     * https://vercel.com/docs/api#endpoints/projects/create-a-project
     */
    async create(options = {}) {
      const url = ctx.url(8, 'projects', { teamId });
      const body = { name, gitRepository: options.git };

      const res = await http.post(url, body, { headers });
      const { ok, status } = res;
      const json = res.json as any;

      const project = (ok ? json : {}) as t.VercelProject;
      const error = ok ? undefined : (json.error as t.VercelHttpError);

      return Delete.undefined({ ok, status, project, error });
    },

    /**
     * Create a new deployment.
     * https://vercel.com/docs/api#endpoints/deployments/create-a-new-deployment
     */
    async deploy(args) {
      if (!(await api.exists())) await api.create();

      if (args.vercelJson && typeof args.source === 'string') {
        const root = ctx.fs.dir(args.source);
        root.json.write('vercel.json', args.vercelJson);
      }

      const projectInfo = await api.info();
      if (projectInfo.error) {
        const error = projectInfo.error;
        const code = error.code ?? '';
        const message = error.message ?? '';
        throw new Error(`Failed to deploy while retrieving project details. [${code}] ${message}`);
      }

      const teamInfo = await team.info();
      if (teamInfo.error) {
        const error = teamInfo.error;
        const code = error.code ?? '';
        const message = error.message ?? '';
        throw new Error(`Failed to deploy while retrieving team details. [${code}] ${message}`);
      }

      return VercellHttpDeploy({
        ...args,
        ctx,
        team: { id: teamId, name: teamInfo.team?.name ?? '' },
        project: { id: projectInfo.project.id, name },
      });
    },
  };

  return api;
}
