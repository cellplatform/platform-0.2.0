import { client } from './Http.client';
import { origin } from './Http.u';

export const DenoHttp = {
  origin,
  client,
} as const;
