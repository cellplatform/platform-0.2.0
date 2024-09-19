import { Pkg, type t } from '../common/mod.ts';

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

    /**
     * GET root info.
     */
    app.get(path, async (c) => {
      const { name, version } = Pkg;
      const module = { name, version };
      const about = `deno:subhosting`;
      const auth = await ctx.auth.verify(c.req.raw);
      const user = auth.claims?.userId;
      const res: t.SubhostingResponse = { about, module, user };
      return c.json(res);
    });
  },
} as const;
