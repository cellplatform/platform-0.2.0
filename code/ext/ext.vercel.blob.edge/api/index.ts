export const config = { runtime: 'edge' };
import { HttpResponse } from '../src';

/**
 * Default Entry.
 */
export default async function (request: Request) {
  const header = (key: string) => request.headers.get(key) || '-';
  return HttpResponse.json(200, {
    service: 'blob',
    edge: { city: header('x-vercel-ip-city'), country: header('x-vercel-ip-country') },
  });
}
