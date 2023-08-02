import { COLORS, type t } from './common';
export * from '../common';

/**
 * Constants
 */
export const DEFAULTS = {
  enabled: true,
  percent: 0,

  get thumb(): Required<t.SliderThumbProps> {
    return { size: 20, color: COLORS.WHITE };
  },
  get track(): Required<t.SliderTrackProps> {
    return { height: 20 };
  },
} as const;
