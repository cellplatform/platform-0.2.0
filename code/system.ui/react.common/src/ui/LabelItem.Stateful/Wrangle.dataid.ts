/**
 * Helpers for formatting data-id attributes.
 */
export const dataid = {
  list: (id?: string) => dataid.format('List', id),
  item: (id?: string) => dataid.format('ListItem', id),
  format(ns: 'ListItem' | 'List', id?: string) {
    return `${ns}:${id || 'unknown'}`;
  },
} as const;
