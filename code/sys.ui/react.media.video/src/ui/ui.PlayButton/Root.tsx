import { DEFAULTS, FC, type t } from './common';
import { Wrangle } from './u';
import { View } from './ui';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  Wrangle: typeof Wrangle;
  sizes: typeof DEFAULTS.sizes;
  statuses: typeof DEFAULTS.statuses;
};
export const PlayButton = FC.decorate<t.PlayButtonProps, Fields>(
  View,
  {
    DEFAULTS,
    Wrangle,
    statuses: DEFAULTS.statuses,
    sizes: DEFAULTS.sizes,
  },
  { displayName: DEFAULTS.displayName },
);
