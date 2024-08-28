import { Is, type t } from './common';

/**
 * Helpers for wrangling the {data} property object.
 */
export const Data = {
  document: {
    uri(data?: t.InfoDoc) {
      if (!data) return '';
      if (Is.doc(data.ref)) return data.ref.uri;
      return data.ref || '';
    },

    list(input: t.InfoData['document']): t.InfoDoc[] {
      if (!input) return [];
      return (Array.isArray(input) ? input : ([input] as t.InfoDoc[])).filter(Boolean);
    },

    item(input: t.InfoData['document'], index: number) {
      return Data.document.list(input)[index];
    },
  },
} as const;
