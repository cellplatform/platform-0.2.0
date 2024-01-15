import { Hono, type t, jsx } from './deps.ts';

/**
 * Hono
 *    Tiny web framework for the edge (Web Standards)
 *    https://hono.dev/top
 */
const app = new Hono();

/**
 * Routes
 */
app.get('/', (c: t.Context) => {
  return c.text('Hello Deno/Hono 👋!!');
});

app.get('/html', (e: t.Context) => {
  return e.html('<h1>hello</h1>');
});

/**
 * Start
 */
Deno.serve({ port: 1234 }, app.fetch);

/**
 * Debug
 */
console.log(`.env: FOO=${Deno.env.get('FOO')}`);
