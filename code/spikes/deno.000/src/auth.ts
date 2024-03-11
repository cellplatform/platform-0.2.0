import { PrivyClient, type t } from './common.ts';

export const Auth = {
  /**
   * Curry an authentication client.
   */
  init(args: { appId: string; appSecret: string }) {
    const client = new PrivyClient(args.appId, args.appSecret);
    const api: t.Auth = {
      client,
      async verify(ctx: t.HonoContext) {
        const header = (ctx.req.header('Authorization') ?? '').trim();
        const token = header.replace(/^Bearer /, '').trim();

        if (!token) return { verified: false };

        try {
          const claims = await client.verifyAuthToken(token);
          return { verified: true, claims };
        } catch (err: unknown) {
          const error = (err as Error).message;
          return { verified: false, error };
        }
      },
    };
    return api;
  },
} as const;
