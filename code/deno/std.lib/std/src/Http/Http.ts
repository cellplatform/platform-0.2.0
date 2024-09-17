import { type t } from '../common.ts';
import { HttpUrl, HttpUrl as Url } from './Http.Url.ts';

/**
 * Http fetch helper.
 */
export const Http = {
  Url,
  url: HttpUrl.create,
} as const;
