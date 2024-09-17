import { FetchClient } from './Http.Client.ts';
import { HttpUrl as Url } from './Http.Url.ts';

/**
 * Http fetch helper.
 */
export const Http = {
  Url,
  url: Url.create,
  client: FetchClient.create,
} as const;
