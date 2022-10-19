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

export default async (req: any) => {
  const url = 'https://undp.db.team/log.public.json';
  const res = await fetch(url);

  return {
    source: url,
    current: res,
  };
};
