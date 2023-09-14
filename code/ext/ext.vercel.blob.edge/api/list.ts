export const config = { runtime: 'edge' };
import { list } from '@vercel/blob';
import { HttpResponse } from '../src';

/**
 * https://vercel.com/docs/storage/vercel-blob/quickstart
 * https://vercel.com/docs/storage/vercel-blob/using-blob-sdk
 */
export default async function blobs(request: Request) {
  const { blobs } = await list();
  return HttpResponse.json(200, blobs);
}
