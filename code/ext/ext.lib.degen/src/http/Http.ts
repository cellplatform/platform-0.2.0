import { Http, type t } from './common';

/**
 * HTTP client for working with the Degen reset API endpoint.
 * https://www.degen.tips/api
 */
export const DegenHttp = {
  http() {
    return Http.create({ headers: {} });
  },
} as const;
