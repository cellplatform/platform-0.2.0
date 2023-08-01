import { type t } from './common';

export type PlayButtonStatus = 'Play' | 'Pause' | 'Replay';

/**
 * Component
 */
export type PlayButtonProps = {
  status?: PlayButtonStatus;
  spinning?: boolean;
  enabled?: boolean;
  style?: t.CssValue;
  onClick?: PlayButtonClickHandler;
};

/**
 * Events
 */
export type PlayButtonClickHandler = (e: PlayButtonClickHandlerArgs) => void;
export type PlayButtonClickHandlerArgs = {
  status: PlayButtonStatus;
  is: {
    playing: boolean; // "play" OR "replay"
    paused: boolean;
  };
  play: boolean;
  pause: boolean;
  replay: boolean;
};
