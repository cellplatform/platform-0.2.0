import { client } from './u.client';
import { origin } from './u.origin';

export const DenoHttp = {
  origin,
  client,
} as const;
