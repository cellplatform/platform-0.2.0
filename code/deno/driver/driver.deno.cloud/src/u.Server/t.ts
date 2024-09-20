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
 * Server for working with the Deno cloud.
 */
export type DenoCloudServerLib = {
  /**
   * Factory to create a new HTTP client.
   */
  client: t.DenoCloudClientLib['client'];

  /**
   * Factory to create a new HTTP server.
   */
  server(args: t.DenoCloudServerArgs): t.HonoApp;
};

export type DenoCloudServerArgs = { env: EnvVars };
