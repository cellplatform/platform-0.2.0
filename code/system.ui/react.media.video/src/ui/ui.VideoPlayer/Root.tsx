import '../../css.mjs';

import { Wrangle } from './Wrangle.mjs';
import { DEFAULTS, FC, type t } from './common';
import { useHasInteracted } from './use.HasInteracted.mjs';
import { useController } from './use.Controller.mjs';
import { View } from './view';

type Fields = {
  DEFAULTS: typeof DEFAULTS;
  Wrangle: typeof Wrangle;
  useHasInteracted: typeof useHasInteracted;
  useController: typeof useController;
};
export const VideoPlayer = FC.decorate<t.VideoPlayerProps, Fields>(
  View,
  { DEFAULTS, Wrangle, useHasInteracted, useController },
  { displayName: 'VideoPlayer' },
);
