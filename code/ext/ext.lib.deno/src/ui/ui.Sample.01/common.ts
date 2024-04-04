import type * as t from './t.ts';
export { type t };

export * from '../common';
export { DenoHttp as Http } from '../../http';

export const DEFAULTS = {
  origins: {
    local: `http://localhost:8080`,
    remote: `https://api.db.team`,
  },
} as const;
