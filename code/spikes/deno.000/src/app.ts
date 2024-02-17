// deno-lint-ignore-file no-explicit-any
import { Routes } from './app.routes.ts';
import { Server, type t } from './u.ts';

export { Routes };

/**
 * Initialize a new web-server.
 * https://hono.dev/top
 */
function init(): t.HonoApp {
  const app = new Server.Hono();

  const cors = Server.cors({
    origin: '*', // Specify allowed origin or use '*' to allow all origins
    allowMethods: ['GET', 'POST'],
    allowHeaders: ['Content-Type'], // Specify allowed headers
    maxAge: 86400, // Specify preflight cache age in seconds
  });

  app.use('*', cors);
  app.use('/static/*', Server.serveStatic({ root: './' }) as any); // Hack (any).

  return app;
}

/**
 * Export
 */
export const App = { init, Routes } as const;
