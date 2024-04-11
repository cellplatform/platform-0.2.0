import { Server } from './common.ts';

const Mime = {
  binary: 'application/octet-stream',
  json: 'application/json',
  text: 'text/plain',
} as const;
const Headers = { binary: { 'Content-Type': Mime.binary } } as const;

/**
 * Application
 */
const app = new Server.Hono();
app.use('*', Server.cors({ origin: '*' }));

/**
 * Routes.
 */
app.get('/', (c) => {
  return c.json({ msg: 'Hello World!' });
});

app.get('/binary', (c) => {
  return c.body(new Uint8Array([1, 2, 3]), 200, Headers.binary);
});

app.post('/echo', async (c) => {
  const type = c.req.header('Content-Type') || '';
  if (type.includes(Mime.text)) return c.text(await c.req.text());
  if (type.includes(Mime.json)) return c.json(await c.req.json());
  if (type.includes(Mime.binary)) {
    const buffer = await c.req.arrayBuffer();
    return c.body(new Uint8Array(buffer), 200, Headers.binary);
  }
  return c.text('Unsupported content type', 415);
});

/**
 * Start
 */
const port = 8080;
Deno.serve({ port }, app.fetch);
