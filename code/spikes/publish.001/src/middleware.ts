import { rewrite, next } from '@vercel/edge';

/**
 * Recommended Cache-Control
 * https://vercel.com/docs/concepts/functions/edge-functions/edge-caching#recommended-cache-control
 */
const headers = {
  'Cache-Control': 's-maxage=1, stale-while-revalidate',
};

/**
 * Sample (WIP)
 * - Load some JSON instructions (the history logs)
 * - Perform rewrites based on URL.
 */
export default async function middleware(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams;

  if (query.has('d')) {
    query.delete('d');
    query.set('dev', 'true');
    return Response.redirect(url.href);
  }

  if (url.pathname.startsWith('/web3/')) {
    url.pathname = url.pathname.replace(/^\/web3\//, ''); // Strip the sub-folder.
    return rewrite(url.href, { headers });
  }

  return next({ headers });
}
