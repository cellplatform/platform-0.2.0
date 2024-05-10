import { HttpHeaders as Headers } from './Http.m.Headers';
import { HttpUrl as Url } from './Http.m.Url';
import { fetcher } from './Http.u.fetch';
import { methods, origin } from './Http.u.methods';
import { HttpIs as Is } from './Http.m.Is';
import { toUint8Array, Path } from '../common';

export const Http = {
  Headers,
  Is,
  Url,
  Path,
  fetcher,
  origin,
  methods,
  toUint8Array,
} as const;
