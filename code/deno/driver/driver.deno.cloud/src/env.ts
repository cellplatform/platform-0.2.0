import { DotEnv } from './u.Server/mod.ts';

const dotenv = await DotEnv.load();
const read = (key: string) => dotenv[key] || Deno.env.get(key) || '';

export const env = {
  /**
   * Deno Cloud
   */
  deno: {
    /**
     * Organization: "sys" (Subhosting)
     * https://docs.deno.com/subhosting/manual
     */
    accessToken: read('DENO_SUBHOSTING_ACCESS_TOKEN'),
    orgId: read('DENO_SUBHOSTING_DEPLOY_ORG_ID'),
  },

  /**
   * Auth: Privy
   */
  privy: {
    appId: read('PRIVY_APP_ID'),
    appSecret: read('PRIVY_APP_SECRET'),
  },
};
