import { type t } from './common';

/**
 * Helpers for wrangling the {data} property object.
 */
export const Data = {
  documents(input?: t.InfoData): t.InfoDoc[] {
    if (!input) return [];
    const target = input.document;
    const res = Array.isArray(target) ? target : ([target] as t.InfoDoc[]);
    return res.filter(Boolean);
  },
} as const;
