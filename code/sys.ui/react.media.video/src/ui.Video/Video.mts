import { PlayBar } from '../ui/ui.PlayBar';
import { PlayButton } from '../ui/ui.PlayButton';
import { VideoPlayer as Player } from '../ui/ui.VideoPlayer';
import { src } from './Video.src.mjs';

export const Video = {
  Player,
  PlayBar,
  PlayButton,
  src,
} as const;
