import type * as t from './t.ts';

export { type t };
export * from '../common';

const urls = {
  local: `http://localhost:8000/ai`,
  prod: `https://api.db.team/ai`,
} as const;

export const DEFAULTS = {
  urls,
  model: {
    get default(): t.ModelName {
      return 'gpt-3.5-turbo';
    },
    get all(): t.ModelName[] {
      return ['gtp-4', 'gpt-3.5-turbo'];
    },
  },
} as const;
