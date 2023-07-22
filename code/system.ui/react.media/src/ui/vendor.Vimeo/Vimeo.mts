import { VimeoPlayer } from './ui.Vimeo.Player';
import { VimeoBackground } from './ui.Vimeo.Background';
import { VimeoEvents } from './Events.mjs';

export { VimeoPlayer, VimeoBackground, VimeoEvents };

export const Vimeo = {
  Player: VimeoPlayer,
  Background: VimeoBackground,
  Events: VimeoEvents,
} as const;
