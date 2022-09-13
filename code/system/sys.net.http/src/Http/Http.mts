import { fromRawHeaders, Mime, toRawHeaders } from '../common/index.mjs';
import { fetch } from './fetch.mjs';
import { create } from './Http.create.mjs';

export const Http = {
  Mime,
  create,
  fetch,
  toRawHeaders,
  fromRawHeaders,
};
