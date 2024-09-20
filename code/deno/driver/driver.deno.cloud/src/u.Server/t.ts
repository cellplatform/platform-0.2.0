import type { RouteContext as RouteContextBase } from '@sys/std-s/types';
import type { t } from './common/mod.ts';

/**
 * Map of the environment variables retrieved from the process ENV variables or a [.env] file.
 */
export type EnvVars = {
  deno: { accessToken: string; orgId: string };
  privy: { appId: string; appSecret: string };
};

/**
 * Context passed to routes.
 */
export type RouteContext = RouteContextBase & { env: EnvVars };

/**
 * Library: Server for working with the Deno cloud.
 */
export type DenoCloudServerLib = {
  client: t.DenoCloudClientLib['client'];
  server(args: t.DenoCloudServerArgs): t.HonoApp;
  env(): Promise<t.EnvVars>;
};

export type DenoCloudServerArgs = {
  env: EnvVars;
  authEnabled?: boolean;
  authLogger?: t.AuthLogger;
};

/**
 * Library: Auth.
 */
export type AuthLib = {
  middleware(ctx: t.RouteContext, options?: t.AuthMiddlewareOptions): t.AuthMiddleware;
};

export type AuthMiddleware = t.HonoMiddlewareHandler<t.HonoEnv, '*'>;
export type AuthMiddlewareOptions = {
  enabled?: boolean;
  logger?: t.AuthLogger;
};

export type AuthLogger = (e: AuthLogEntry) => void;
export type AuthLogEntry = {
  status: 'OK' | 'Skipped:Disabled' | 'Skipped:Allowed';
  path: string;
};
