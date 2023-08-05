import { type t } from './common';

export * from '../common';
export { SplitLayout } from '../-sys.common.Layout.Split';

/**
 * Constants
 */

export const DEFAULTS = {
  split: 0.6,
  muted: false,

  image: {
    get sizing(): t.ImageSizeStrategy {
      return 'contain';
    },
  },
} as const;
