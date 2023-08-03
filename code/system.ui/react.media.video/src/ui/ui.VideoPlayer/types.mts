import { type t } from './common';

export type VideoPlayerProps = {
  enabled?: boolean;
  video?: t.VideoSrc;
  timestamp?: t.Seconds;

  playing?: boolean;
  loop?: boolean;
  muted?: boolean;

  width?: t.Pixels; // NB: set [width] OR [height] not both. If both set then [width] is used.
  height?: t.Pixels;
  aspectRatio?: string; // eg. "16:9" ← "width:height"
  innerScale?: t.Percent; // NB: useful for clipping noise at the border of a video (eg. 1.1).

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
