import { type t } from './common';

export type PlayButtonStatus = 'Play' | 'Pause' | 'Replay' | 'Spinning';

/**
 * Component
 */
export type PlayButtonProps = {
  status?: PlayButtonStatus;
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
};
