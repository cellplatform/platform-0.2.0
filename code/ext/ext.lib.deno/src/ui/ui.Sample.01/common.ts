import type * as t from './t.ts';
export { type t };
export * from '../common';

export const DEFAULTS = {
  urls: {
    local: `http://localhost:8000/`,
    prod: `https://api.db.team/`,
  },
} as const;
