import type { t } from './common.ts';

import type { Hono, Context as HonoContext } from '@hono/hono';
import type { cors } from '@hono/hono/cors';
import type { serveStatic } from '@hono/hono/deno';
import type { BlankSchema, Env } from '@hono/hono/types';

type Pkg = { name: string; version: string };

/**
 * Webserver.
 */
export type ServerLib = {
  readonly Auth: t.ServerAuth;
  readonly Hono: typeof Hono;
  readonly cors: typeof cors;
  readonly static: typeof serveStatic;
  create(options?: ServerCreateOptions): HonoApp;
  options(port?: number, pkg?: Pkg): Deno.ServeOptions;
  print(addr: Deno.NetAddr, pkg?: Pkg): void;
};

export type ServerCreateOptions = {
  cors?: boolean;
  static?: boolean;
};

/**
 * Hono Server (application instnace).
 */
export type HonoApp = Hono<Env, BlankSchema, '/'>;
export type { HonoContext };

/**
 * Route
 */
export type RouteContext = {
  readonly app: t.HonoApp;
  readonly auth: t.AuthCtx;
};
