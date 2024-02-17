import type * as t from './t.ts';
export * from '../common';
export { type t };

export const DEFAULTS = {
  urls: {
    local: `http://localhost:8080/ai`,
    prod: `https://api.db.team/ai`,
  },
  model: {
    get default(): t.ModelName {
      return 'gpt-3.5-turbo';
    },
    get all(): t.ModelName[] {
      return ['gtp-4', 'gpt-3.5-turbo'];
    },
  },
} as const;
