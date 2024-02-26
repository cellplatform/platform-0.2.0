import { DEFAULTS, type t } from './common';

const urls = DEFAULTS.origins;

export const Http = {
  url(forcePublic = false) {
    const isLocalhost = location.hostname === 'localhost';
    const url = isLocalhost && !forcePublic ? urls.local : urls.prod;
    return url;
  },

  async fetchCompletion(
    text: string,
    options: { model?: t.ModelName; forcePublicUrl?: boolean } = {},
  ) {
    // Setup.
    const { model = DEFAULTS.model.default } = options;
    const url = Http.url(options.forcePublicUrl);
    const body: t.MessagePayload = {
      model,
      messages: [{ role: 'user', content: text }],
    };

    // Fetch.
    console.info(`fetching: ${url}`);
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    console.info(`fetched: ${res.status}`);

    // Finish up.
    const json = await res.json();
    const completion = json.completion;
    return typeof completion === 'object' ? (completion as t.Completion) : undefined;
  },
} as const;
