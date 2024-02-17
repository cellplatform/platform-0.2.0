import { fetcher, origin } from './Http.fetcher';
import { methods } from './Http.methods';
import { statusOK } from './common';

export const Http = {
  statusOK,
  origin,
  fetcher,
  methods,
} as const;
