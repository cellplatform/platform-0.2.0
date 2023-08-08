import { DEFAULTS, type t, Is } from './common';

/**
 * Helpers
 */
export const Wrangle = {
  title(item?: t.SlugNamespace) {
    if (!item) return DEFAULTS.untitled;
    return (item.title || item.namespace).trim() || DEFAULTS.untitled;
  },

  namespace(item?: t.SlugListItem) {
    return Is.namespace(item) ? item : undefined;
  },

  slug(item?: t.SlugListItem) {
    return Is.slug(item) ? item : undefined;
  },
} as const;
