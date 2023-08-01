import { type t } from './common';
export * from '../common';

import { DEFAULTS as PlayButtonDefaults } from '../ui.PlayButton/common';
import { DEFAULTS as VideoPlayerDefaults } from '../ui.VideoPlayer/common';
export { PlayButton } from '../ui.PlayButton';

/**
 * Constants
 */
const button: t.PlayBarPropsButton = {};
const progress: t.PlayBarPropsProgress = {};

export const DEFAULTS = {
  enabled: true,
  height: PlayButtonDefaults.height,
  button,
  progress,
  get status() {
    return VideoPlayerDefaults.emptyStatus;
  },
} as const;
