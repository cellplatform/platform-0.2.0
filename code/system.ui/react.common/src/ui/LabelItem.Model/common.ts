import { type t } from '../common';
export * from '../common';

import { rx } from '../common';
export const mapVoid = rx.map(() => undefined);

/**
 * Constants
 */
export const DEFAULTS = {
  data: {
    get item(): t.LabelItem {
      return {};
    },
    get list(): t.LabelList {
      return {};
    },
  },
} as const;
