import { EnvVars } from '../env.ts';
import { DenoCloudClient, Server, type t } from './common/mod.ts';
import { Root } from './r.root/mod.ts';
import { Subhosting } from './r.subhosting/mod.ts';

type Opt = t.DenoCloudServerOptions;

/**
 * Server library.
 */
export const DenoCloud: t.DenoCloudServerLib = {
  client: DenoCloudClient.client,
  server(options = {}) {
    const app = Server.create();
    const auth = wrangle.auth(options);
    const ctx: t.RouteContext = { app, auth };
    Root.routes(ctx);
    Subhosting.routes('/subhosting', ctx);
    return app;
  },
};

/**
 * Helpers
 */
const wrangle = {
  privy(options: Opt) {
    if (typeof options.privy === 'object') return options.privy;
    return EnvVars.privy;
  },

  auth(options: Opt) {
    const privy = wrangle.privy(options);
    return Server.Auth.ctx(privy.appId, privy.appSecret);
  },
} as const;
