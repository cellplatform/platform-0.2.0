import type { t } from './common/mod.ts';

/**
 * Server for working with the Deno cloud.
 */
export type DenoCloud = {
  /**
   * Factory to create a new HTTP server.
   */
  server(): t.HonoApp;
};
