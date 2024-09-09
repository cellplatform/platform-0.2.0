import { type t } from './common';

/**
 * Helpers for wrangling the {data} property object.
 */
export const Data = {
  documents(input?: t.InfoData['document']): t.InfoDoc[] {
    if (!input) return [];
    const res = Array.isArray(input) ? input : [input];
    return res.filter(Boolean);
  },
} as const;
