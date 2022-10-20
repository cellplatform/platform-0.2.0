import { Data } from './fn.data';

export const config = {
  runtime: 'experimental-edge',
};

/**
 * Vercel Refs:
 *
 * - JSON (Config)
 *   https://vercel.com/docs/project-configuration
 *
 * - Edge Functions
 *   https://vercel.com/docs/concepts/functions/edge-functions
 *
 * - Serverless Functions
 *   https://vercel.com/docs/concepts/functions/serverless-functions
 *
 * - Build Output API
 *   https://vercel.com/docs/build-output-api/v3
 */

export default (req: Request) => {
  return new Response(Data.msg);
};
