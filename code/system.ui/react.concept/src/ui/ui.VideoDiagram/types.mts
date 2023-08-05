import { type t } from './common';

/**
 * Definition
 */
export type SlugVideo = {
  src?: t.VideoSrc;
  innerScale?: number;
};

export type SlugImage = {
  src?: t.ImageSrc;
  sizing?: t.ImageSizeStrategy; // 'cover' | 'contain';
  scale?: number;
};

/**
 * Component
 */
export type VideoDiagramProps = {
  video?: t.SlugVideo;
  image?: t.SlugImage;

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
