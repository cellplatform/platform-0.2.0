// deno-lint-ignore-file no-explicit-any
import { DEFAULTS, Hono, Is, OpenAI, cors, type t } from './u.ts';

const apiKey = Deno.env.get('OPENAI_API_KEY');
const openai = new OpenAI({ apiKey });

const app = new Hono();
app.use(
  '*',
  cors({
    origin: '*', // Specify allowed origin or use '*' to allow all origins
    allowMethods: ['GET', 'POST'],
    allowHeaders: ['Content-Type'], // Specify allowed headers
    maxAge: 86400, // Specify preflight cache age in seconds
  }),
);

/**
 * Home
 */
app.get('/', (c) => {
  const about = `openai relay ← (🦄 teamdb)`;
  return c.text(about);
});

/**
 * AI
 */
app.get('/ai', async (c) => {
  const res = await openai.models.list();
  const models = res.data.map((m) => {
    const { id, created, owned_by: ownedBy } = m;
    return { id, created, ownedBy } as t.ModelListItem;
  });
  return c.json({ models });
});
app.post('/ai', async (c) => {
  const body = await c.req.json();

  if (!Is.messagePayload(body)) {
    return c.text('Post body is not a [MessagePayload]', 400);
  }

  const messages = body.messages as any;
  const model = body.model ?? DEFAULTS.model;
  const completion = await openai.chat.completions.create({ model, messages });
  return c.json({ completion });
});

/**
 * Initialize
 */
Deno.serve(app.fetch);
