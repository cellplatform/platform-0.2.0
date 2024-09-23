import { DenoCloudClient, type t } from './common/mod.ts';
import { server } from './u.Server.ts';

export { c, Env, Pkg, HttpServer } from './common/mod.ts';

/**
 * Server library.
 */
export const DenoCloud: t.DenoCloudServerLib = {
  client: DenoCloudClient.client,
  server,

  async env() {
    const { env } = await import('../env.ts');
    return env;
  },
};
