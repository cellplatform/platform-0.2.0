import { Path, Mime, Util } from '../common';
import { httpFetch } from './fetch';
import { create } from './Http.create';
import { url, host } from './Http.url';

const { toRawHeaders, fromRawHeaders } = Util;

export const Http = {
  create,
  Mime,
  Path,

  fetch: httpFetch,
  url,
  host,
  toRawHeaders,
  fromRawHeaders,
} as const;
