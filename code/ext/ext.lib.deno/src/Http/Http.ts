import { client } from './Http.client';
import { fetcher, origin, toMethods } from './Http.fetch';

export const Http = {
  origin,
  client,
  fetcher,
  toMethods,
} as const;
