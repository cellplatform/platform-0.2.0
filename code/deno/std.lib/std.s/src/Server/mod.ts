import { type t } from '../common.ts';

import { Hono } from '@hono/hono';
import { cors } from '@hono/hono/cors';
import { serveStatic } from '@hono/hono/deno';

/**
 * Server Lib.
 */
export const Server: t.Server = {
  Hono,
  cors,
  static: serveStatic,

  /**
   * Create a new Hono application instance with cors and /static file server.
   */
  create(options = {}) {
    const app = new Server.Hono();

    if (options.cors ?? true) {
      app.use(
        '*',
        Server.cors({
          origin: '*', // Allowed origin or use '*' to allow all origins.
          allowMethods: ['GET', 'POST'],
          allowHeaders: ['Content-Type', 'Authorization'],
          maxAge: 86400, // Preflight cache age in seconds.
        }),
      );
    }

    if (options.static ?? true) {
      app.use('/static/*', Server.static({ root: './' }));
    }

    return app;
  },
} as const;
