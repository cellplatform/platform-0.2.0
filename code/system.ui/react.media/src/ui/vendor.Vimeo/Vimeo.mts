import { VimeoEvents } from './Events.mjs';
import { VimeoBackground } from './ui.Vimeo.Background';
import { VimeoPlayer } from './ui.Vimeo.Player';
import { usePlayer } from './hooks';

export { VimeoBackground, VimeoEvents, VimeoPlayer, usePlayer };

export const Vimeo = {
  Player: VimeoPlayer,
  Background: VimeoBackground,
  Events: VimeoEvents,
  usePlayer,
} as const;
