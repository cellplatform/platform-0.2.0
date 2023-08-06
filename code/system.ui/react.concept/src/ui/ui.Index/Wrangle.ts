import { DEFAULTS, type t, Is } from './common';

/**
 * Helpers
 */
export const Wrangle = {
  title(item?: t.SlugNamespace) {
    if (!item) return DEFAULTS.untitled;
    return (item.title || item.namespace).trim() || DEFAULTS.untitled;
  },
} as const;
