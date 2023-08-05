import { type t } from './common';

export type PlayButtonStatus = 'Play' | 'Pause' | 'Replay';
export type PlayButtonSize = 'Small' | 'Medium' | 'Large';

/**
 * Component
 */
export type PlayButtonProps = {
  status?: PlayButtonStatus;
  size?: PlayButtonSize;
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
  readonly status: PlayButtonStatus;
  readonly play: boolean;
  readonly pause: boolean;
  readonly replay: boolean;
  readonly is: {
    readonly playing: boolean; // "play" OR "replay"
    readonly paused: boolean;
  };
};
