import { type t } from './common';

/**
 * Definition
 */
export type VideoDiagramVideo = {
  src?: t.VideoSrc;
  innerScale?: number;
};

/**
 * Component
 */
export type VideoDiagramLayoutProps = {
  video?: t.VideoDiagramVideo;

  muted?: boolean;
  playing?: boolean;
  timestamp?: t.Seconds;

  split?: t.Percent;
  splitMin?: t.Percent;
  splitMax?: t.Percent;
  debug?: boolean;

  style?: t.CssValue;
  onVideoStatus?: t.VideoPlayerStatusHandler;
};
