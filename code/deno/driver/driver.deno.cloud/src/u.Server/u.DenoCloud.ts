import { DenoCloudClient, Server, type t } from './common/mod.ts';
import { Root } from './r.root/mod.ts';
import { Subhosting } from './r.subhosting/mod.ts';

/**
 * Server library.
 */
export const DenoCloud: t.DenoCloudServerLib = {
  client: DenoCloudClient.client,

  server() {
    const app = Server.create();
    const ctx: t.RouteContext = { app };

    Root.routes(ctx);
    Subhosting.routes('/subhosting', ctx);

    return app;
  },
};
