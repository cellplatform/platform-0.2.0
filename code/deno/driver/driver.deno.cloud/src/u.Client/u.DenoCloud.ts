import { Http, type t } from './common/mod.ts';

/**
 * Client for working with a DenoCloud server HTTP endpoint.
 */
export const DenoCloud: t.DenoCloudClientLib = {
  client(base, options = {}) {
    const { accessToken } = options;
    const url = Http.url(base);
    const client = Http.client({ accessToken });

    /**
     * API
     */
    const api: t.DenoCloudClient = {
      url,
      async root() {
        const url = api.url.join();
        const res = await client.get(url);
        return Http.toResponse<t.RootResponse>(res);
      },
    };
    return api;
  },
};
