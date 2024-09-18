import { Http, Is, type t } from '../common.ts';

/**
 * Routes for the "Deno Subhosting" management API.
 * https://docs.deno.com/subhosting/manual
 */
export function routes(
  path: string,
  ctx: t.RouteContext,
  env: { orgId: string; accessToken: string },
) {
  const { orgId, accessToken } = env;
  const { app } = ctx;
  const http = Http.init({ accessToken });

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
    const claims = await ctx.auth.verify(c);
    // console.log('claims', claims);

    const qs = new URL(c.req.url).search;
    const url = Http.url('organizations', orgId, `projects${qs}`);
    const res = await http.get(url);
    if (!Is.statusOK(res)) return c.text(Http.failedUpstream(res), 500);
    const projects = (await res.json()) as t.DenoProject[];
    console.log('projects', projects);
    return c.json(projects);
  });

  /**
   * POST Create project.
   */
  app.post(`${path}/projects`, async (c) => {
    const url = Http.url('organizations', orgId, 'projects');
    const body = (await c.req.json()) as t.DenoProjectCreateArgs;
    const res = await http.post(url, body);

    if (!Is.statusOK(res)) return c.text(Http.failedUpstream(res), 500);
    return c.json({ created: true, data: await res.json() });
  });

  /**
   * GET Deployments.
   */
  app.get(`${path}/projects/:projectId/deployments`, async (c) => {
    const qs = new URL(c.req.url).search;
    const url = Http.url('projects', c.req.param('projectId'), `deployments${qs}`);
    const res = await http.get(url);

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
    const res = await http.post(url, body);

    if (!Is.statusOK(res)) return c.text(Http.failedUpstream(res), 500);
    const deployment = (await res.json()) as t.DenoDeployment;
    return c.json(deployment);
  });
}

/**
 * Export
 */
export default routes;
