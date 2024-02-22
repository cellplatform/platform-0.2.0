// deno-lint-ignore-file no-explicit-any
import { Server } from './common/mod.ts';
import openai from './route.openai/mod.ts';
import deno from './route.deno/mod.ts';

/**
 * Initialize a new HTTP server.
 */
const app = new Server.Hono();

const cors = Server.cors({
  origin: '*', // Allowed origin or use '*' to allow all origins.
  allowMethods: ['GET', 'POST'],
  allowHeaders: ['Content-Type'],
  maxAge: 86400, // Preflight cache age in seconds.
});

app.use('*', cors);
app.use('/static/*', Server.serveStatic({ root: './' }) as any); // Hack (any).

/**
 * Routes.
 */
app.get('/', (c) => c.text(`tdb ← (🦄 team:db)`));
openai('/ai', app);
deno('/deno', app);

/**
 * Start
 */
const port = 8080;
Deno.serve({ port }, app.fetch);
