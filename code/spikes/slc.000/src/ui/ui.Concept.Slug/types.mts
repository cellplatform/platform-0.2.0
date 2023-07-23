import { type t } from './common';

type VideoId = number;

export type ConceptSlugProps = {
  vimeo?: t.VimeoInstance;
  video?: ConceptSlugVideo;
  style?: t.CssValue;
};

export type ConceptSlugVideo = {
  id?: VideoId; // Video-identifier (eg. 499921561 on vimeo).
  position?: t.PositionInput;
  scale?: number;
};
