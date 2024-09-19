import { DenoSubhostingAPI, EnvVars, Pkg, type t } from '../common/mod.ts';

/**
 * Helpers for working with the Deno sub-hosting system.
 * https://docs.deno.com/subhosting/manual
 */
export const Subhosting = {
  /**
   * Setup routes for deploying and managing sub-hosting instances.
   */
  routes(path: string, ctx: t.RouteContext) {
    const { app } = ctx;

    const subhosting = new DenoSubhostingAPI({ bearerToken: EnvVars.deno.accessToken });

    /**
     * GET root info.
     */
    app.get(path, async (c) => {
      const auth = await ctx.auth.verify(c.req.raw);
      const verified = auth.verified;
      const organization = await subhosting.organizations.get(EnvVars.deno.orgId);

      const { name, version } = Pkg;
      const module = { name, version };
      const description = `deno:subhosting™️ controller`;
      const identity = auth.claims?.userId ?? '';
      const res: t.SubhostingInfo = {
        description,
        module,
        auth: { identity, verified },
        organization,
      };

      return c.json(res);
    });
  },
} as const;
