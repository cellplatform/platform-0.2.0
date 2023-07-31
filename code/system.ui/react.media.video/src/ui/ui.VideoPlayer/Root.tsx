import '../../css.mjs';

import { Wrangle } from './Wrangle.mjs';
import { DEFAULTS, FC, type t } from './common';
import { View } from './ui';
import { useHasInteracted } from './use.HasInteracted.mjs';
import { useStateController } from './use.StateController.mjs';

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
  Wrangle: typeof Wrangle;
  useHasInteracted: typeof useHasInteracted;
  useStateController: typeof useStateController;
};
export const VideoPlayer = FC.decorate<t.VideoPlayerProps, Fields>(
  View,
  { DEFAULTS, Wrangle, useHasInteracted, useStateController },
  { displayName: 'VideoPlayer' },
);
