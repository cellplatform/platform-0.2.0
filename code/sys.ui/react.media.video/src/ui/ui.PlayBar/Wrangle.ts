import { DEFAULTS, type t } from './common';

import { Wrangle as PlayButtonWrangle } from '../ui.PlayButton/Wrangle';

export const Wrangle = {
  toPlayStatus(props: t.PlayBarProps): t.PlayButtonStatus {
    const { status = DEFAULTS.status, replay = DEFAULTS.replay } = props;
    if (replay && status.is.complete) return 'Replay';
    return status.is.playing ? 'Pause' : 'Play';
  },

  sizes(props: t.PlayBarProps) {
    const { size = DEFAULTS.size } = props;
    const button = PlayButtonWrangle.sizes(props);
    const height = button.height;
    return { size, height } as const;
  },
} as const;
