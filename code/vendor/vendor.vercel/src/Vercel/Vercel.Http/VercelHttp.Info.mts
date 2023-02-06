import { type t } from './common/index.mjs';

export const VercelHttpInfo = {
  /**
   * Derive information about the authenticated user (via API "token").
   */
  async user(args: { http: t.Http; headers: t.VercelHttpHeaders }) {
    const { http, headers } = args;

    // https://vercel.com/docs/rest-api#endpoints/user/get-the-authenticated-user
    const url = 'https://api.vercel.com/www/user';
    const res = await http.get(url, { headers });

    const { ok, status } = res;
    const json = res.json as any;

    const user = ok ? (json.user as t.VercelHttpUser) : undefined;
    const error = ok ? undefined : (json.error as t.VercelHttpError);

    return { ok, status, user, error };
  },
};
