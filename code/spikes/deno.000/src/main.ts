// deno-lint-ignore-file no-explicit-any
import { Server, EnvVars, Path } from './common.ts';
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
openai('/openai', app, EnvVars.openai);
deno.subhosting('/deno', app, EnvVars.deno);

/**
 * FaceAPI
 */
app.get('/faceapi/models/:name', async (c) => {
  const name = c.req.param('name');
  const path = Path.resolve('./src.api.face/models', name);
  const exists = await Path.exists(path);
  return exists ? c.body(await Deno.readFile(path)) : c.status(404);
});

/**
 * Start
 */
const port = 8080;
Deno.serve({ port }, app.fetch);
