import { type t } from './common';

export type ConceptPlayerProps = {
  vimeo?: t.VimeoInstance;
  video?: ConceptPlayerVideo;
  style?: t.CssValue;
};

export type ConceptPlayerVideo = {
  id?: number; // Video-identifier (eg. 499921561 on vimeo)
  pos?: t.Pos;
};
