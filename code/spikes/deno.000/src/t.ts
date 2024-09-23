export type Msecs = number;

/**
 * Web server
 * https://hono.dev/api
 */
import type { Hono, Context as HonoContext } from 'npm:hono';
import type { BlankSchema, Env } from 'npm:hono/types';

export type HonoApp = Hono<Env, BlankSchema, '/'>;
export { HonoContext };

/**
 * Authorization
 */
import type { PrivyClient, AuthTokenClaims } from 'npm:@privy-io/server-auth';
export type Auth = {
  client: PrivyClient;
  verify(ctx: HonoContext): Promise<VerifyResponse>;
};

export type VerifyResponse = { verified: boolean; claims?: AuthTokenClaims; error?: string };

/**
 * Route
 */
export type RouteContext = { app: HonoApp; auth: Auth };
