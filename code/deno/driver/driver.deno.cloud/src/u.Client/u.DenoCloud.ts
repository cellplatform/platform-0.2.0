import { Http, type t } from './common/mod.ts';

/**
 * Client for working with a DenoCloud server HTTP endpoint.
 */
export const DenoCloud: t.DenoCloudClientLib = {
  client(base, options = {}) {
    const { accessToken } = options;

    const url = Http.url(base);
    const api: t.DenoCloudClient = { url };
    return api;
  },
};
