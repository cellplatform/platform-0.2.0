import { type t } from './common';

export type VideoPlayerProps = {
  video?: t.VideoDef;
  playing?: boolean;
  loop?: boolean;
  timestamp?: t.Seconds;
  borderRadius?: t.Pixels;
  style?: t.CssValue;
  onChange?: VideoPlayerChangeHandler;
};

/**
 * Events
 */
export type VideoPlayerChangeHandler = (e: VideoPlayerChangeHandlerArgs) => void;
export type VideoPlayerChangeHandlerArgs = {
  video: t.VideoDef;
  status: t.VideoStatus;
};
