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

  onStatus?: VideoPlayerStatusHandler;
};

/**
 * Events
 */
export type VideoPlayerStatusHandler = (e: VideoPlayerStatusHandlerArgs) => void;
export type VideoPlayerStatusHandlerArgs = {
  video: t.VideoSrc;
  status: t.VideoStatus;
};
