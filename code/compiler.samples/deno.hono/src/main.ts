import { Hono, type t } from './deps.ts';

/**
 * Sample: --env flag
 */
console.log(`.env: FOO=${Deno.env.get('FOO')}`);

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

/**
 * Start
 */
Deno.serve({ port: 1234 }, app.fetch);
