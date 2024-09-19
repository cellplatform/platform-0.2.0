import { DenoCloudClient, Server, type t } from './common/mod.ts';
import { Root } from './r.root/mod.ts';
import { Subhosting } from './r.subhosting/mod.ts';

/**
 * Server library.
 */
export const DenoCloud: t.DenoCloudServerLib = {
  client: DenoCloudClient.client,
  server(args) {
    const { env } = args;
    const app = Server.create();
    const auth = wrangle.auth(args);
    const ctx: t.RouteContext = { app, auth, env };
    Root.routes(ctx);
    Subhosting.routes('/subhosting', ctx);
    return app;
  },
};

/**
 * Helpers
 */
const wrangle = {
  auth(options: t.DenoCloudServerOptions) {
    const privy = options.env.privy;
    return Server.Auth.ctx(privy.appId, privy.appSecret);
  },
} as const;
