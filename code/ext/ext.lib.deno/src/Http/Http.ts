import { client } from './Http.client';
import { fetcher, methods, origin } from './Http.fetch';
import { statusOK } from './common';

export const Http = {
  statusOK,
  origin,
  fetcher,
  methods,
  client,
} as const;
