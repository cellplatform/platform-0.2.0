import { Server } from './common.ts';

/**
 * Application
 */
const app = new Server.Hono();
const cors = Server.cors({
  origin: '*',
  allowMethods: ['GET', 'POST'],
  allowHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400,
});
app.use('*', cors);

/**
 * Routes.
 */
app.get('/', (c) => {
  return c.json({ msg: 'Hello World!' });
});

/**
 * Start
 */
const port = 8080;
Deno.serve({ port }, app.fetch);
