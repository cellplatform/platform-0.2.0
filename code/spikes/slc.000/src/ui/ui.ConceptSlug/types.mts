import { type t } from './common';

export type ConceptSlugProps = {
  vimeo?: t.VimeoInstance;
  video?: ConceptSlugVideo;
  style?: t.CssValue;
};

export type ConceptSlugVideo = {
  id?: number; // Video-identifier (eg. 499921561 on vimeo).
  position?: t.Pos;
};
