import '../../css.mjs';

import { Wrangle } from './Wrangle.mjs';
import { DEFAULTS, FC, type t } from './common';
import { View } from './ui';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  Wrangle: typeof Wrangle;
};
export const VideoPlayer = FC.decorate<t.VideoPlayerProps, Fields>(
  View,
  { DEFAULTS, Wrangle },
  { displayName: 'VideoPlayer' },
);
