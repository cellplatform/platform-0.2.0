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
    app.get(path, (c) => {
      const { name, version } = Pkg;
      const about = `deno:subhosting`;
      const res: t.SubhostingResponse = { about, module: { name, version } };
      return c.json(res);
    });
  },
} as const;
