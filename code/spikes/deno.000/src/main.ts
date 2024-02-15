// deno-lint-ignore-file no-explicit-any
import { Hono, Is, OpenAI, cors } from './common.ts';

const app = new Hono();
const apiKey = Deno.env.get('OPENAI_API_KEY');
const openai = new OpenAI({ apiKey });

app.use(
  '*',
  cors({
    origin: '*', // Specify allowed origin or use '*' to allow all origins
    allowMethods: ['GET', 'POST'],
    allowHeaders: ['Content-Type'], // Specify allowed headers
    maxAge: 86400, // Specify preflight cache age in seconds
  }),
);

app.get('/', (c) => {
  const tmp = '';
  const text = `Hello 🤖:AI relay! ← (🦄 teamdb) ${tmp}`.trim();
  return c.text(text);
});

app.get('/ai', async (c) => {
  const chatCompletion = await openai.chat.completions.create({
    messages: [{ role: 'user', content: 'Say this is a test' }],
    model: 'gpt-3.5-turbo',
  });

  return c.json(chatCompletion);
});

app.post('/ai', async (c) => {
  const body = await c.req.json();

  if (!Is.messagePayload(body)) {
    return c.text('Post body is not a [MessagePayload]', 400);
  }

  const messages = body.messages as any;
  const completion = await openai.chat.completions.create({
    messages,
    model: 'gpt-3.5-turbo',
  });

  return c.json({ completion });
});

/**
 * Initialize
 */
Deno.serve(app.fetch);
