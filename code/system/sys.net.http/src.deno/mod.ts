import { Hono } from './common.ts';
const app = new Hono();

/**
 * Routes.
 */
app.get('/', (c) => {
  return c.json({ foo: 123 });
});

/**
 * Start
 */
const port = 8080;
Deno.serve({ port }, app.fetch);
