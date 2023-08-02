import { type t } from './common';

export * from '../common';

/**
 * Constants
 */
const thumb: Required<t.SliderThumbProps> = {
  height: 20,
};

const track: Required<t.SliderTrackProps> = {
  height: 20,
};

export const DEFAULTS = {
  percent: 0,
  thumb,
  track,
} as const;
