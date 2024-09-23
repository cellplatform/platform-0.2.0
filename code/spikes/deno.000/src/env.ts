import { load } from 'https://deno.land/std@0.218.2/dotenv/mod.ts';
const env = await load();

/**
 * Environment Variables (.env file)
 */
export const EnvVars = {
  /**
   * OpenAI
   * https://platform.openai.com/api-keys
   */
  openai: { apiKey: env['OPENAI_API_KEY'] },

  /**
   * Deno Cloud
   */
  deno: {
    /**
     * Organization: "sys" (Subhosting)
     * https://docs.deno.com/subhosting/manual
     */
    accessToken: env['DENO_SUBHOSTING_ACCESS_TOKEN'],
    orgId: env['DENO_SUBHOSTING_DEPLOY_ORG_ID'],
  },

  /**
   * Auth: Privy
   */
  privy: {
    appId: env['PRIVY_APP_ID'],
    appSecret: env['PRIVY_APP_SECRET'],
  },
} as const;
