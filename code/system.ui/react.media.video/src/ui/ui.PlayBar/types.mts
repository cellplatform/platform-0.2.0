import { type t } from './common';

export type PlayBarProps = {
  status?: t.VideoStatus;
  button?: PlayBarPropsButton;
  progress?: PlayBarPropsProgress;
  right?: false | JSX.Element;
  enabled?: boolean;
  replay?: boolean;
  style?: t.CssValue;
  onPlayClick?: t.PlayButtonClickHandler;
  onProgressClick?: t.ProgressBarClickHandler;
};

export type PlayBarPropsButton = {};
export type PlayBarPropsProgress = {
  thumbColor?: string;
  bufferedColor?: string;
};
