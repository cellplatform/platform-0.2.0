import { PlayBar } from '../ui/ui.PlayBar';
import { PlayButton } from '../ui/ui.PlayButton';
import { VideoPlayer as Player } from '../ui/ui.VideoPlayer';
import { toSrc } from './Video.toSource.mjs';

export const Video = {
  Player,
  PlayBar,
  PlayButton,
  toSrc,
} as const;
