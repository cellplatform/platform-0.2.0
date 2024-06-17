import { client } from './DenoHttp.client';
import { origin } from './DenoHttp.origin';

export const DenoHttp = {
  origin,
  client,
} as const;
