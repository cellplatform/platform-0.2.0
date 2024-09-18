import { Http, type t } from './common/mod.ts';

/**
 * Factory: create a strongly typed HTTP client for working
 *          against a DenoCloud server HTTP endpoint.
 *
 * - https://deno.com/deploy
 * - https://docs.deno.com/subhosting/manual
 *
 */
export const client: t.DenoCloudClientLib['client'] = (base, options = {}) => {
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
      const raw = await client.get(url);
      const res = await Http.toResponse<t.RootResponse>(raw);
      return res;
    },
  };
  return api;
};
