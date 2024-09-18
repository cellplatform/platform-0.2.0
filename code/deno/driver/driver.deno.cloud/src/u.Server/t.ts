import type { t } from './common/mod.ts';

/**
 * Server for working with the Deno cloud.
 */
export type DenoCloudServerLib = {
  /**
   * Factory to create a new HTTP server.
   */
  server(): t.HonoApp;

  /**
   * Factory to create a new HTTP client.
   */
  client: t.DenoCloudClientLib['client'];
};
