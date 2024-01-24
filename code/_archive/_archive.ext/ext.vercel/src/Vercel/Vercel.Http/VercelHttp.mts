import { Http, t, Util } from './common/index.mjs';
import { VercelHttpTeam } from './VercelHttp.Team.mjs';
import { VercelHttpInfo } from './VercelHttp.Info.mjs';

/**
 * A wrapper around the Vercel HTTP endpoints API.
 * See:
 *    https://vercel.com/docs/api#endpoints
 *
 *    SHA1 (digest) filehash checking example:
 *    https://vercel.com/docs/integrations#webhooks/securing-webhooks
 */
export function VercelHttp(args: {
  fs: t.Fs;
  token: string;
  version?: number;
  http?: t.Http;
}): t.VercelHttp {
  const http = args.http ?? Http.create();
  const ctx = Util.toCtx(args.fs, http, args.token, args.version);
  const { headers } = ctx;

  const api: t.VercelHttp = {
    ctx,

    async info() {
      return VercelHttpInfo.user(ctx);
    },

    teams: {
      /**
       * Retrieve list of teams.
       * https://vercel.com/docs/api#endpoints/teams/list-all-your-teams
       */
      async list() {
        const url = ctx.url(1, 'teams');
        const res = await http.get(url, { headers });

        const { ok, status } = res;
        const json = res.json as any;
        const teams = !ok ? [] : (json.teams as t.VercelTeam[]);
        const error = ok ? undefined : (json.error as t.VercelHttpError);
        return { ok, status, teams, error };
      },

      /**
       * Retrieve a single team by "name".
       */
      async byName(name) {
        name = (name || '').trim();
        const list = (await api.teams.list()).teams;
        const match = list.find((item) => item.name === name);
        return match ? api.team(match.id) : undefined;
      },
    },

    /**
     * Retrieve a single team.
     */
    team(teamId) {
      return VercelHttpTeam({ ctx, teamId });
    },
  };

  return api;
}
