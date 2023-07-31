export * from '../common';

import { DEFAULTS as PlayButtonDefaults } from '../ui.PlayButton/common';
export { PlayButton } from '../ui.PlayButton';

/**
 * Constants
 */
export const DEFAULTS = {
  height: PlayButtonDefaults.height,
} as const;
