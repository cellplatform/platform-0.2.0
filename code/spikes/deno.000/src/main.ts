import deno from '../src.api.deno/mod.ts';
import faceapi from '../src.api.face/mod.ts';
import openai from '../src.api.openai/mod.ts';
import { EnvVars } from './common.ts';

/**
 * Initialize a new HTTP server
 */
import { app } from './main.app.ts';

/**
 * Routes
 */
app.get('/', (c) => c.text(`tdb ← (🦄 team:db)`));
deno.subhosting('/deno', app, EnvVars.deno);
openai('/openai', app, EnvVars.openai);
faceapi('/faceapi', app);

/**
 * Start
 */
const port = 8080;
Deno.serve({ port }, app.fetch);
