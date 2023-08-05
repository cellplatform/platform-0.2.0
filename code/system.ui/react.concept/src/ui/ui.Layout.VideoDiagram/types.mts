import { type t } from './common';

/**
 * Definition
 */
export type VideoDiagramVideo = {
  src?: t.VideoSrc;
  muted?: boolean;
  timestamp?: t.Seconds;
  playing?: boolean;
  innerScale?: number;
};

/**
 * Component
 */
export type VideoDiagramLayoutProps = {
  video?: t.VideoDiagramVideo;

  split?: t.Percent;
  splitMin?: t.Percent;
  splitMax?: t.Percent;
  debug?: boolean;

  style?: t.CssValue;
  onVideoStatus?: t.VideoPlayerStatusHandler;
};
