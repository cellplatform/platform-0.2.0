import deno from '../src.api.deno/main.ts';
import faceapi from '../src.api.face/main.ts';
import openai from '../src.api.openai/main.ts';
import { Auth } from './auth.ts';
import { EnvVars, type t } from './common.ts';

/**
 * Initialize a new HTTP server
 */
import { app } from './main.app.ts';
const auth = Auth.init(EnvVars.privy);
const ctx: t.RouteContext = { app, auth };

/**
 * Routes
 */
app.get('/', async (c) => {
  const authentication = await auth.verify(c);
  return c.json({ status: 200, message: `tdb ← (🦄 team:db)`, authentication });
});

deno.subhosting('/deno', ctx, EnvVars.deno);
openai('/openai', ctx, EnvVars.openai);
faceapi('/faceapi', ctx);

/**
 * Start
 */
const port = 8080;
Deno.serve({ port }, app.fetch);
