import { type t } from './common';

/**
 * Component
 */
export type VideoLayoutProps = {
  video?: VideoLayout;
  style?: t.CssValue;
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
