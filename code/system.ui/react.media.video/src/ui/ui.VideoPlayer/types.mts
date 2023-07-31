import { type t } from './common';

export type VideoPlayerProps = {
  enabled?: boolean;
  video?: t.VideoSrc;
  playing?: boolean;
  loop?: boolean;
  timestamp?: t.Seconds;
  muted?: boolean;
  borderRadius?: t.Pixels;
  style?: t.CssValue;
  onChange?: VideoPlayerChangeHandler;
};

/**
 * Events
 */
export type VideoPlayerChangeHandler = (e: VideoPlayerChangeHandlerArgs) => void;
export type VideoPlayerChangeHandlerArgs = {
  video: t.VideoSrc;
  status: t.VideoStatus;
};
