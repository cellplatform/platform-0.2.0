import { VimeoEvents } from './Events.mjs';
import { VimeoBackground } from './ui.Vimeo.Background';
import { VimeoPlayer } from './ui.Vimeo.Player';

export { VimeoBackground, VimeoEvents, VimeoPlayer };

export const Vimeo = {
  Player: VimeoPlayer,
  Background: VimeoBackground,
  Events: VimeoEvents,
} as const;
