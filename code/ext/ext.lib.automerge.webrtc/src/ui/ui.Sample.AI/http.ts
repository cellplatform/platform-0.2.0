import { type t } from './common';

const urls = {
  local: `http://localhost:8000/ai`,
  prod: `https://tdb.deno.dev/ai`,
} as const;

export const Http = {
  urls,

  url() {
    const isLocalhost = location.hostname === 'localhost';
    const url = isLocalhost ? urls.local : urls.prod;
    return url;
  },

  async getCompletion(text: string) {
    const url = location.hostname === 'localhost' ? urls.local : urls.prod;
    const body: t.MessagePayload = { messages: [{ role: 'user', content: text }] };
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    const completion = json.completion;
    return typeof completion === 'object' ? (completion as t.Completion) : undefined;
  },
} as const;
