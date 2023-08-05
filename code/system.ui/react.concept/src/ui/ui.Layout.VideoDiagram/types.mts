import { type t } from './common';

/**
 * Definition
 */
export type VideoDiagramVideo = {
  src?: t.VideoSrc;
  innerScale?: number;
};

export type VideoDiagramImage = {
  src?: t.ImageSrc;
  sizing?: t.ImageSizeStrategy;
};

/**
 * Component
 */
export type VideoDiagramLayoutProps = {
  video?: t.VideoDiagramVideo;
  image?: t.VideoDiagramImage;

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
