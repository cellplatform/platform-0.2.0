import { type t } from './common';

/**
 * Helpers for wrangling the {data} property object.
 */
export const WrangleData = {
  asDocArray(data?: t.InfoData): t.InfoDataDoc[] {
    if (!data) return [];
    const res = Array.isArray(data.document) ? data.document : [data.document];
    return res.filter(Boolean) as t.InfoDataDoc[];
  },
} as const;
