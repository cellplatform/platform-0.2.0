import { Pkg, type t } from '../common/mod.ts';

/**
 * Setup routes for deploying and managing sub-hosting instances.
 */
export function routes(ctx: t.RouteContext) {
  const { app } = ctx;

  /**
   * GET: root.
   */
  app.get('/', (c) => {
    const { name, version } = Pkg;
    const module = { name, version };
    const res: t.RootResponse = { module };
    return c.json(res);
  });
}
