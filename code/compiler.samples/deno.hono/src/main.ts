import { dotenv, Hono, type t } from './deps.ts';
const _env = await dotenv.load();
const app = new Hono();

app.get('/', (c: t.Context) => {
  return c.text('Hello Deno/Hono 👋!!');
});

Deno.serve({ port: 1234 }, app.fetch);
