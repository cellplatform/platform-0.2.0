import { Pkg, type t } from './common';
export * from '../common';

import { DEFAULTS as PlayButtonDefaults } from '../ui.PlayButton/common';
import { DEFAULTS as VideoPlayerDefaults } from '../ui.VideoPlayer/common';
export { PlayButton } from '../ui.PlayButton';

/**
 * Constants
 */

const button: t.PlayBarPropsButton = {};
const progress: t.PlayBarPropsProgress = {};

const { size, sizes } = PlayButtonDefaults;

export const DEFAULTS = {
  displayName: `${Pkg.name}:PlayBar`,
  enabled: true,
  replay: true,
  useKeyboard: false,
  size,
  sizes,
  button,
  progress,
  get status() {
    return VideoPlayerDefaults.emptyStatus;
  },
} as const;
