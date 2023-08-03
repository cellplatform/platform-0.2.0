import { type t } from './common';

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

/**
 * Component
 */
export type VideoLayoutProps = {
  data?: VideoLayout;
  playing?: boolean;
  timestamp?: t.Seconds;
  muted?: boolean;
  debug?: boolean;
  style?: t.CssValue;
  onStatus?: t.VideoPlayerStatusHandler;
  onSize?: t.VideoLayoutSizeHandler;
};

/**
 * Events
 */

export type VideoLayoutSizeHandler = (e: VideoLayoutSizeHandlerArgs) => void;
export type VideoLayoutSizeHandlerArgs = {
  parent: t.DomRect;
  video: t.DomRect;
};

