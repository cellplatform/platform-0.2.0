import type * as t from './t.ts';

export { type t };
export * from '../common';

export const DEFAULTS = {
  model: {
    get default(): t.ModelName {
      return 'gpt-3.5-turbo';
    },
    get all(): t.ModelName[] {
      return ['gtp-4', 'gpt-3.5-turbo'];
    },
  },
} as const;
