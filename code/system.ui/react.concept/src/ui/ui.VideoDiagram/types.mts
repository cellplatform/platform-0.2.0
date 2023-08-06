import { type t } from './common';

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
