// deno-lint-ignore-file no-explicit-any
import { Server, EnvVars } from './common.ts';
import openai from '../src.api.openai/mod.ts';
import deno from '../src.api.deno/mod.ts';

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
 * Routes
 */
app.get('/', (c) => c.text(`tdb ← (🦄 team:db)`));
openai('/ai', app, EnvVars.openai);
deno.subhosting('/deno', app, EnvVars.deno);

/**
 * Start
 */
const port = 8080;
Deno.serve({ port }, app.fetch);
