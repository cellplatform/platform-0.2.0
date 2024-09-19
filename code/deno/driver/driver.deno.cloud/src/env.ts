import { DotEnv } from './u.Server/mod.ts';
const env = await DotEnv.load();

export const EnvVars = {
  /**
   * Deno Cloud
   */
  deno: {
    /**
     * Organization: "sys" (Subhosting)
     * https://docs.deno.com/subhosting/manual
     */
    accessToken: env['DENO_SYS_DEPLOY_ACCESS_TOKEN'],
    orgId: env['DENO_SYS_DEPLOY_ORG_ID'],
  },

  /**
   * Auth: Privy
   */
  privy: {
    appId: env['PRIVY_APP_ID'],
    appSecret: env['PRIVY_APP_SECRET'],
  },
};
