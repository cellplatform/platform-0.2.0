import { type t } from '../common';
export * from '../common';

/**
 * Constants
 */
export const DEFAULTS = {
  data: {
    get item(): t.LabelItem {
      return {};
    },
    get list(): t.LabeList {
      return {};
    },
  },
} as const;
