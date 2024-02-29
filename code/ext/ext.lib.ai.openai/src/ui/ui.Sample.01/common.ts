import type * as t from './t.ts';
export * from '../common';
export { type t };

export const DEFAULTS = {
  origins: {
    local: `http://localhost:8080/openai`,
    prod: `https://api.db.team/openai`,
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
