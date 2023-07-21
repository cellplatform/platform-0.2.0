import { Util, Mime } from '../common/index.mjs';
import { fetch } from './fetch.mjs';
import { create } from './Http.create.mjs';

const { toRawHeaders, fromRawHeaders } = Util;

export const Http = {
  Mime,
  create,
  fetch,
  toRawHeaders,
  fromRawHeaders,
};
