import type * as t from './t.ts';
export { type t };
export * from '../common';

export const DEFAULTS = {
  origins: {
    local: `http://localhost:8080`,
    prod: `https://api.db.team`,
  },
} as const;
