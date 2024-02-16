// deno-lint-ignore-file no-explicit-any
import { DEFAULTS, Is, OpenAI, type t } from './u.ts';

const apiKey = Deno.env.get('OPENAI_API_KEY');
const openai = new OpenAI({ apiKey });

/**
 * OpenAI route setup.
 */
export function routes(app: t.HonoApp) {
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

    // openai.audio.transcriptions.create()

    const messages = body.messages as any;
    const model = body.model ?? DEFAULTS.model;
    const completion = await openai.chat.completions.create({ model, messages });
    return c.json({ completion });
  });
}
