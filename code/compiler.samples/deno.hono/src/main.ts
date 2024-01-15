import { Hono, type t } from './deps.ts';
const app = new Hono();

console.log(`.env: FOO=${Deno.env.get('FOO')}`);

app.get('/', (c: t.Context) => {
  return c.text('Hello Deno/Hono 👋!!');
});

Deno.serve({ port: 1234 }, app.fetch);
