import { client } from './Http.client';
import { origin } from './Http.origin';

export const DenoHttp = {
  origin,
  client,
} as const;
