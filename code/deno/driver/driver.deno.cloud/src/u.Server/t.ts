import type { t } from './common/mod.ts';

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
  server(options?: t.DenoCloudServerOptions): t.HonoApp;
};

export type DenoCloudServerOptions = {
  privy?: { appId: string; appSecret: string };
};
