export const config = { runtime: 'edge' };
import { HttpResponse } from '../src';

/**
 * Default entry.
 */
export default async function (request: Request) {
  const header = (key: string) => request.headers.get(key) || '-';
  const payload = {
    service: 'sample.vercel.edge',
    edge: {
      city: header('x-vercel-ip-city'),
      country: header('x-vercel-ip-country'),
    },
  };
  return HttpResponse.json(200, payload);
}
