import { rewrite, next } from '@vercel/edge';

/**
 * Sample (WIP)
 * - Load some JSON instructions (the history logs)
 * - Perform rewrites based on URL.
 */
export default async function middleware(request: any) {
  const url = new URL(request.url);
  url.pathname = '/log.public.json';

  const res = await fetch(url.href);
  const isJson = (res.headers.get('content-type') || '').includes('application/json');

  if (res.status === 200 && isJson) {
    const json = await res.json();
    console.log('json:', JSON.stringify(json).substring(0, 30));
  }

  // return rewrite(`https://tdb-8nzsnfy6p-tdb.vercel.app`);
  return next();
}
