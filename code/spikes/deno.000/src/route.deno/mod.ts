import { Http } from './u.Http.ts';
import { Env, Is, type t } from './u.common.ts';

/**
 * Routes for the "Deno Subhosting" manaagement API.
 * https://docs.deno.com/subhosting/manual
 */
export default function init(path: string, app: t.HonoApp) {
  const { orgId } = Env.Vars.deno;

  /**
   * GET root info.
   */
  app.get(path, (c) => {
    const about = `deno:subhosting`;
    const baseurl = Http.Url.base;
    return c.json({ about, baseurl });
  });

  /**
   * GET List projects.
   */
  app.get(`${path}/projects`, async (c) => {
    const qs = new URL(c.req.url).search;
    const url = Http.url('organizations', orgId, `projects${qs}`);
    const res = await Http.get(url);
    if (!Is.statusOK(res)) return c.text(Http.failedUpstream(res), 500);
    const projects = (await res.json()) as t.DenoProject[];
    return c.json(projects);
  });

  /**
   * POST Create project.
   */
  app.post(`${path}/projects`, async (c) => {
    const url = Http.url('organizations', orgId, 'projects');
    const body = (await c.req.json()) as t.DenoProjectCreateArgs;
    const res = await Http.post(url, body);

    if (!Is.statusOK(res)) return c.text(Http.failedUpstream(res), 500);
    return c.json({ created: true, data: await res.json() });
  });

  /**
   * GET Deployments.
   */
  app.get(`${path}/projects/:projectId/deployments`, async (c) => {
    const qs = new URL(c.req.url).search;
    const url = Http.url('projects', c.req.param('projectId'), `deployments${qs}`);
    const res = await Http.get(url);

    if (!Is.statusOK(res)) return c.text(Http.failedUpstream(res), 500);
    const deployments = (await res.json()) as t.DenoDeployment[];
    return c.json(deployments);
  });

  /**
   * POST Deploy.
   */
  app.post(`${path}/projects/:projectId/deployments`, async (c) => {
    const url = Http.url('projects', c.req.param('projectId'), 'deployments');
    const body = (await c.req.json()) as t.DenoDeployArgs;
    const res = await Http.post(url, body);

    if (!Is.statusOK(res)) return c.text(Http.failedUpstream(res), 500);
    const deployment = (await res.json()) as t.DenoDeployment;
    return c.json(deployment);
  });
}
