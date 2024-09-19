import { DotEnv } from './u.Server/mod.ts';
const dotenv = await DotEnv.load();

export const env = {
  /**
   * Deno Cloud
   */
  deno: {
    /**
     * Organization: "sys" (Subhosting)
     * https://docs.deno.com/subhosting/manual
     */
    accessToken: dotenv['DENO_SYS_DEPLOY_ACCESS_TOKEN'],
    orgId: dotenv['DENO_SYS_DEPLOY_ORG_ID'],
  },

  /**
   * Auth: Privy
   */
  privy: {
    appId: dotenv['PRIVY_APP_ID'],
    appSecret: dotenv['PRIVY_APP_SECRET'],
  },
};
