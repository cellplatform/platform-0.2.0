// deno-lint-ignore-file no-explicit-any
import { DEFAULTS, Is, OpenAI, type t } from './u.ts';
import { Env } from './env.ts';

/**
 * OpenAI route setup.
 */
export function init(path: string, app: t.HonoApp) {
  const apiKey = Env.Vars.openai.apiKey;
  const openai = new OpenAI({ apiKey });

  app.get(path, async (c) => {
    const res = await openai.models.list();
    const models = res.data.map((m) => {
      const { id, created, owned_by: ownedBy } = m;
      return { id, created, ownedBy } as t.ModelListItem;
    });
    return c.json({ models });
  });

  app.post(path, async (c) => {
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
