import { list } from '@vercel/blob';
import { HttpResponse } from '../common.js';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { blobs } = await list();
  return HttpResponse.json(200, blobs);
}
