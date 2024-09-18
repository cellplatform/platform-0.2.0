import { Pkg, type t } from '../common/mod.ts';

export const Root = {
  /**
   * Setup routes for deploying and managing sub-hosting instances.
   */
  routes(ctx: t.RouteContext) {
    const { app } = ctx;

    app.get('/', (c) => {
      const { name, version } = Pkg;
      const res: t.RootResponse = { module: { name, version } };
      return c.json(res);
    });
  },
} as const;
