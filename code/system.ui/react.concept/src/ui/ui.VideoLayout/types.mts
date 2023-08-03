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
  id?: t.VideoSrcInput;
  position?: t.EdgePositionInput;
  innerScale?: t.Percent;
  height?: t.PixelOrPercent;
  minHeight?: t.Pixels;
};
