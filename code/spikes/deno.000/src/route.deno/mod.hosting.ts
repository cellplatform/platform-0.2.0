import { Env, Is, type t } from './u.common.ts';

/**
 * Routes for the "Deno Subhosting" manaagement API.
 * https://docs.deno.com/subhosting/manual
 */
export function init(path: string, app: t.HonoApp) {
  const { accessToken, orgId } = Env.Vars.deno.subhosting;
  const baseurl = 'https://api.deno.com/v1';
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };

  const failedUpstream = (res: Response) => {
    return `Failed upstream api with [${res.status}] ${res.statusText}`.trim();
  };

  /**
   * GET root info
   */
  app.get(path, (c) => {
    const about = `deno:subhosting`;
    return c.json({ about, baseurl });
  });

  /**
   * GET list projects.
   */
  app.get(`${path}/projects`, async (c) => {
    const qs = new URL(c.req.url).search;
    const url = `${baseurl}/organizations/${orgId}/projects${qs}`;
    const res = await fetch(url, { method: 'GET', headers });
    if (!Is.statusOK(res)) return c.text(failedUpstream(res), 500);

    const projects = await res.json();
    return c.json(projects);
  });

  /**
   * POST create project.
   */
  app.post(`${path}/projects`, async (c) => {
    const url = `${baseurl}/organizations/${orgId}/projects`;
    const body = (await c.req.json()) as t.DenoProjectCreateArgs;
    const res = await fetch(url, {
      headers,
      method: 'POST',
      body: JSON.stringify(body),
    });

    if (!Is.statusOK(res)) return c.text(failedUpstream(res), 500);

    const data = await res.json();
    return c.json({ created: true, data });
  });

  /**
   * DELETE project
   */
  app.delete(`${path}/projects`, async (c) => {
    //
    /**
     * TODO 🐷
     */
  });
}
