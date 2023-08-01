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
  onPlayAction?: t.PlayButtonClickHandler;
  onSeek?: PlayBarSeekHandler;
  onMute?: PlayBarMuteHandler;
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

export type PlayBarMuteHandler = (e: PlayBarMuteHandlerArgs) => void;
export type PlayBarMuteHandlerArgs = { muted: boolean };
