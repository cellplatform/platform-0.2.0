import { HttpHeaders as Headers } from './Http.m.Headers';
import { HttpUrl as Url } from './Http.m.Url';
import { fetcher } from './Http.u.fetch';
import { methods } from './Http.u.methods';

export const Http = {
  Headers,
  Url,
  fetcher,
  methods,
} as const;
