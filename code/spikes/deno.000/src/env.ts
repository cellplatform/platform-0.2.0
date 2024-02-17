import { load } from 'https://deno.land/std/dotenv/mod.ts';
const env = await load();

/**
 * Environment Variables (.env file)
 */
export const Env = {
  Vars: {
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
       * Organization: Sys (Subhosting)
       * https://docs.deno.com/subhosting/manual
       */
      subhosting: {
        accessToken: env['SYS_DEPLOY_ACCESS_TOKEN'],
        orgId: env['SYS_DEPLOY_ORG_ID'],
      },
    },
  },
} as const;
