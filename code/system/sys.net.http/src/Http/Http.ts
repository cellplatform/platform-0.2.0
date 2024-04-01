import { Mime, Util } from '../common';
import { fetch } from './fetch';
import { create } from './Http.create';

const { toRawHeaders, fromRawHeaders } = Util;

export const Http = {
  Mime,
  create,
  fetch,
  toRawHeaders,
  fromRawHeaders,
} as const;
