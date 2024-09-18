import type { Hono, Context as HonoContext } from '@hono/hono';
import type { cors } from '@hono/hono/cors';
import type { serveStatic } from '@hono/hono/deno';
import type { BlankSchema, Env } from '@hono/hono/types';

/**
 * Webserver.
 */
export type Server = {
  readonly Hono: typeof Hono;
  readonly cors: typeof cors;
  readonly static: typeof serveStatic;
  create(options?: { cors?: boolean; static?: boolean }): HonoApp;
};

/**
 * Hono Server (application instnace).
 */
export type HonoApp = Hono<Env, BlankSchema, '/'>;
export type { HonoContext };

/**
 * Routes
 */
export type RouteContext = {
  readonly app: HonoApp;
};
