import { type t } from './common';

export type PlayBarProps = {
  status?: t.VideoStatus;
  button?: PlayBarPropsButton;
  progress?: PlayBarPropsProgress;
  right?: false | JSX.Element;
  enabled?: boolean;
  replay?: boolean;
  useKeyboard?: boolean;
  style?: t.CssValue;
  onPlayChange?: t.PlayButtonClickHandler;
  onSeek?: PlayBarSeekHandler;
};

export type PlayBarPropsButton = {};
export type PlayBarPropsProgress = {
  thumbColor?: string;
  bufferedColor?: string;
};

/**
 * Events
 */
export type PlayBarSeekHandler = (e: PlayBarSeekHandlerArgs) => void;
export type PlayBarSeekHandlerArgs = {
  status: t.VideoStatus;
  seconds: t.Seconds;
};
