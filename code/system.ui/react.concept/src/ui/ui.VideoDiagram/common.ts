import { type t } from './common';

export * from '../common';

/**
 * Constants
 */
export const DEFAULTS = {
  split: 0.6,
  muted: false,

  image: {
    scale: 1,
    get sizing(): t.ImageSizeStrategy {
      return 'contain';
    },
  },
} as const;
