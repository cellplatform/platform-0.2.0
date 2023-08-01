import { type t } from './common';

export type PlayBarProps = {
  enabled?: boolean;
  status?: t.VideoStatus;
  button?: PlayBarPropsButton;
  progress?: PlayBarPropsProgress;
  style?: t.CssValue;
  onPlayClick?: t.PlayButtonClickHandler;
  onProgressClick?: t.ProgressBarClickHandler;
};

export type PlayBarPropsButton = {};
export type PlayBarPropsProgress = {
  thumbColor?: string;
  bufferedColor?: string;
};
