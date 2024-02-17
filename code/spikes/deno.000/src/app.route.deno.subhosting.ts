import { type t } from './u.ts';
import { Env } from './env.ts';

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

  app.get(path, async (c) => {
    const about = `deno:subhosting`;

    // List projects.
    const url = `${baseurl}/organizations/${orgId}/projects`;
    const res = await fetch(url, { method: 'GET', headers });
    const projects = await res.json();

    return c.json({
      about,
      current: { projects },
    });
  });
}
