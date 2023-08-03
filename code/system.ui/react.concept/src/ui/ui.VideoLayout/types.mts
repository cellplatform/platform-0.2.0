import { type t } from './common';

/**
 * Component
 */
export type VideoLayoutProps = {
  data?: VideoLayout;
  playing?: boolean;
  timestamp?: t.Seconds;
  muted?: boolean;
  style?: t.CssValue;
  onStatus?: t.VideoPlayerStatusHandler;
};

/**
 * Definition
 */
export type VideoLayout = {
  id?: t.VideoSrcInput; // Video-identifier (eg. 499921561 on vimeo).
  position?: t.EdgePositionInput;
  innerScale?: t.Percent;
  height?: number;
};
