import { PrivyClient, type t } from './common.ts';

/**
 * Helpers for auth (authentication and authorization).
 */
export const Auth: t.ServerAuth = {
  /**
   * Factory: create an Auth context helper.
   */
  ctx(appId, appSecret) {
    const client = new PrivyClient(appId, appSecret);
    return {
      /**
       * Verify a user's access token (JWT)
       * https://docs.privy.io/guide/server/authorization/verification#verifying-the-user-s-access-token
       */
      async verify(input): Promise<t.AuthVerification> {
        const token = wrangle.accessToken(input);
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
  },
};

/**
 * Helpers
 */
const wrangle = {
  accessToken(input: string | Request) {
    const text = typeof input === 'string' ? input : input.headers.get('Authorization') ?? '';
    return text.replace(/^Bearer /, '').trim();
  },
} as const;
