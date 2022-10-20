import { data } from './fn.data';

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
  // Sample.
  const url = req.url;
  const json = JSON.stringify({ url, data });

  return new Response(json, { status: 200, headers: [['content-type', 'application/json']] });
};
